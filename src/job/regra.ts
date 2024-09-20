import dayLib from '../libs/dayjs.js';

interface ITimeSlot {
  start: string; // Usando string para facilitar o uso de dayjs
  end: string;
}

function getFreeTimeSlots(
  workingHours: ITimeSlot[],
  occupiedSlots: ITimeSlot[],
  requiredMinutes: number,
  currentTime: string,
): string[] {
  const freeSlots: string[] = [];
  const now = dayLib(currentTime).add(15, 'minute'); // Considerar 15 minutos adicionais

  workingHours.forEach((shift) => {
    let currentStart = dayLib(shift.start);
    const shiftEnd = dayLib(shift.end);

    // Garantir que o currentStart comece no mínimo 15 minutos após a hora atual, caso a consulta seja durante o turno
    if (currentStart.isBefore(now)) {
      currentStart = now;
    }

    // Filtrar os horários ocupados que estão dentro deste turno
    const relevantOccupiedSlots = occupiedSlots
      .filter(
        (slot) =>
          dayLib(slot.start).isBetween(shift.start, shift.end, null, '[)') ||
          dayLib(slot.end).isBetween(shift.start, shift.end, null, '[)'),
      )
      .sort((a, b) => dayLib(a.start).diff(dayLib(b.start))); // Ordenar por horário de início

    // Verificar os espaços livres em intervalos de acordo com o valor de requiredMinutes
    while (
      currentStart.add(requiredMinutes, 'minute').isBefore(shiftEnd) ||
      currentStart.add(requiredMinutes, 'minute').isSame(shiftEnd)
    ) {
      // Verificar se o currentStart está dentro de um slot ocupado
      const conflictingSlot = relevantOccupiedSlots.find((slot) =>
        currentStart.isBetween(
          dayLib(slot.start),
          dayLib(slot.end),
          null,
          '[)',
        ),
      );

      if (conflictingSlot) {
        // Ajustar o currentStart para o fim do slot ocupado
        currentStart = dayLib(conflictingSlot.end);
      } else {
        // Se não há conflito, adicionar ao array de slots livres
        freeSlots.push(currentStart.format('YYYY-MM-DD HH:mm:ss'));

        // Incrementar pelo tempo de atendimento necessário
        currentStart = currentStart.add(requiredMinutes, 'minute');
      }
    }
  });

  return freeSlots;
}

// Exemplo de uso:
const workingHours: ITimeSlot[] = [
  { start: '2024-09-06 08:00:00', end: '2024-09-06 12:00:00' },
  { start: '2024-09-06 14:00:00', end: '2024-09-06 20:00:00' },
];

const occupiedSlots: ITimeSlot[] = [
  { start: '2024-09-06 08:00:00', end: '2024-09-06 08:40:00' },
  { start: '2024-09-06 09:30:00', end: '2024-09-06 10:00:00' },
  { start: '2024-09-06 14:30:00', end: '2024-09-06 15:00:00' },
];

const requiredMinutes = 30; // Tempo necessário para o atendimento
const currentTime = '2024-09-06 09:00:00'; // Hora da consulta

const freeTimeSlots = getFreeTimeSlots(
  workingHours,
  occupiedSlots,
  requiredMinutes,
  currentTime,
);

console.log(freeTimeSlots);
