import { JsonValue } from '@prisma/client/runtime/library';
import { Dayjs } from 'dayjs';

import dayLib from '../../../../libs/dayjs';
import { prismaClient } from '../../../../libs/prismaClient';

interface IInput {
  requiredMinutes: number;
  date: string;
  professionalId: number;
  isAuthenticated: boolean;
  isIgnoreBreak: boolean;
}

interface IOutput {
  result: IFreeSlot[];
}

interface IFreeSlot {
  display: string;
  total: number;
}

interface ITimeSlot {
  start: Dayjs;
  end: Dayjs;
}

interface IWorkingTime {
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

export class ListFreeTimeSlotsUseCase {
  async execute({
    date,
    professionalId,
    requiredMinutes,
    isAuthenticated,
    isIgnoreBreak,
  }: IInput): Promise<IOutput> {
    const freeSlots: IFreeSlot[] = [];
    const now = dayLib().add(isAuthenticated ? 0 : 15, 'minute');
    const dateDayStart = dayLib(date).startOf('day');

    isIgnoreBreak = isAuthenticated && isIgnoreBreak;

    const workingDay = await prismaClient.workingDay.findUnique({
      where: {
        professionalId_date: { date: dateDayStart.toDate(), professionalId },
      },
    });

    if (!workingDay || workingDay.isClosed) {
      return { result: [] };
    }

    const workingHours = this.getWorkingHours(
      workingDay.time,
      dateDayStart,
      isIgnoreBreak,
    );

    const bookings = await this.getBookingsForDay(dateDayStart);

    const occupiedSlots = this.convertBookingsToTimeSlots(
      bookings,
      dateDayStart,
    );

    workingHours.forEach((shift) => {
      this.findFreeTimeSlots(
        freeSlots,
        shift,
        occupiedSlots,
        now,
        requiredMinutes,
      );
    });

    return {
      result: freeSlots,
    };
  }

  private getWorkingHours(
    timeData: JsonValue,
    dateDayStart: Dayjs,
    isIgnoreBreak: boolean,
  ): ITimeSlot[] {
    const workingTime = timeData as unknown as IWorkingTime;

    const workStart = dateDayStart.add(workingTime.start, 'm');
    const workEnd = dateDayStart.add(workingTime.end, 'm');

    let workPeriods: ITimeSlot[] = [{ start: workStart, end: workEnd }];

    if (isIgnoreBreak) {
      return workPeriods;
    }

    workingTime.breaks.forEach((breakPeriod) => {
      const breakStart = dateDayStart.add(breakPeriod.start, 'm');
      const breakEnd = dateDayStart.add(breakPeriod.end, 'm');

      workPeriods = workPeriods.flatMap((period) => {
        if (breakStart.isBetween(period.start, period.end, null, '[)')) {
          return [
            { start: period.start, end: breakStart },
            { start: breakEnd, end: period.end },
          ];
        }
        return [period];
      });
    });

    return workPeriods;
  }

  private async getBookingsForDay(dateDayStart: Dayjs) {
    return prismaClient.booking.findMany({
      where: {
        date: {
          gte: dateDayStart.toDate(),
          lte: dateDayStart.endOf('day').toDate(),
        },
        status: 'CONFIRMED',
      },
      orderBy: { date: 'asc' },
    });
  }

  private convertBookingsToTimeSlots(
    bookings: any[],
    dateDayStart: Dayjs,
  ): ITimeSlot[] {
    return bookings.map<ITimeSlot>((el) => ({
      start: dateDayStart.add(el.startTime, 'm'),
      end: dateDayStart.add(el.endTime, 'm'),
    }));
  }

  private findFreeTimeSlots(
    freeSlots: IFreeSlot[],
    shift: ITimeSlot,
    occupiedSlots: ITimeSlot[],
    now: Dayjs,
    requiredMinutes: number,
  ) {
    let currentStart = shift.start;
    const shiftEnd = shift.end;

    // Ajuste para garantir que o início não seja antes do horário atual (agora)
    if (currentStart.isBefore(now)) {
      currentStart = now;
    }

    // Ajuste para arredondar o minuto atual para o próximo múltiplo de 10 minutos
    const currentMinutes = currentStart.minute();
    if (currentMinutes % 10 !== 0) {
      currentStart = currentStart.add(10 - (currentMinutes % 10), 'minute');
    }
    currentStart = currentStart.second(0); // Zera os segundos para garantir precisão

    // Filtrar os horários ocupados que estão dentro deste turno específico
    const relevantOccupiedSlots = occupiedSlots
      .filter(
        (slot) =>
          slot.start.isBetween(shift.start, shift.end, null, '[)') ||
          slot.end.isBetween(shift.start, shift.end, null, '[)'),
      )
      .sort((a, b) => a.start.diff(b.start)); // Ordena os slots ocupados por horário de início

    // Verificar intervalos livres entre ocupações e até o final do turno
    while (
      currentStart.add(requiredMinutes, 'minute').isBefore(shiftEnd) ||
      currentStart.add(requiredMinutes, 'minute').isSame(shiftEnd)
    ) {
      // Encontra o próximo slot ocupado que conflita com o início atual
      const conflictingSlot = relevantOccupiedSlots.find((slot) =>
        currentStart.isBetween(slot.start, slot.end, null, '[)'),
      );

      if (conflictingSlot) {
        // Se houver conflito, ajusta o início para o fim do slot ocupado
        currentStart = conflictingSlot.end;
      } else {
        // Encontra o próximo slot ocupado após o currentStart
        const nextSlot = relevantOccupiedSlots.find((slot) =>
          slot.start.isAfter(currentStart),
        );

        // Verifica se há tempo suficiente entre o currentStart e o próximo slot ocupado
        if (
          !nextSlot ||
          currentStart.add(requiredMinutes, 'minute').isBefore(nextSlot.start)
        ) {
          // Se houver tempo suficiente, adiciona o horário livre
          freeSlots.push({
            display: currentStart.format('HH:mm'),
            total: currentStart.hour() * 60 + currentStart.minute(),
          });

          // Avança o currentStart pelo tempo necessário para o serviço
          currentStart = currentStart.add(requiredMinutes, 'minute');
        } else {
          // Se não houver tempo suficiente até o próximo slot, pula para o final do próximo slot
          currentStart = nextSlot.end;
        }
      }
    }
  }
}
