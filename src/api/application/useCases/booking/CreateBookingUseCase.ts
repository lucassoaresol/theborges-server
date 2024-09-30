import { Dayjs } from 'dayjs';

import Database from '../../../../db/pg';
import { IDataDict } from '../../../../interfaces/dataDict';
import dayLib from '../../../../libs/dayjs';
import { prismaClient } from '../../../../libs/prismaClient';
import { PublicIdGenerator } from '../../../../services/PublicIdGenerator';
import { capitalizeFirstName } from '../../../../utils/capitalizeFirstName';
import { getFormattedDate } from '../../../../utils/getFormattedDate';
import { insertIntoTable } from '../../../../utils/insertIntoTable';
import { AppError } from '../../errors/appError';

interface IInput {
  date: string;
  startTime: number;
  endTime: number;
  forPersonName: string | undefined;
  clientId: number;
  professionalId: number;
  services: { price: number; serviceId: number; order: number }[];
}

interface IOutput {
  result: {
    id: number;
    date: Date;
    clientId: number;
    createdAt: Date;
    endTime: number;
    forPersonName: string | null;
    professionalId: number;
    publicId: string;
    startTime: number;
    status: string;
    updatedAt: Date;
    client: {
      id: number;
      name: string;
      phone: string;
      email: string;
      birthDay: number | null;
      birthMonth: number | null;
      wantsPromotions: boolean;
      publicId: string;
      createdAt: Date;
      updatedAt: Date;
    };
    services: {
      price: number;
      order: number;
      service: {
        id: number;
        name: string;
        description: string;
        durationMinutes: number;
        price: number;
        color: string;
        categoryId: number;
        isAdditional: boolean;
        additionalPrice: number | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }[];
  };
}

interface IWorkingTime {
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

export class CreateBookingUseCase {
  constructor(
    private publicIdGenerator: PublicIdGenerator,
    private clientId: string,
    private readonly templateName: {
      new: string;
      new_person: string;
    },
  ) {}

  async execute({
    clientId,
    date,
    endTime,
    forPersonName,
    professionalId,
    services,
    startTime,
  }: IInput): Promise<IOutput> {
    const publicId = await this.publicIdGenerator.generate('booking');
    const dateDay = dayLib(date).startOf('day');

    const workingDay = await prismaClient.workingDay.findUnique({
      where: {
        professionalId_date: { professionalId, date: dateDay.toDate() },
      },
    });

    if (!workingDay || workingDay.isClosed) {
      throw new AppError('O profissional não está disponível neste dia.');
    }

    const workingTime = workingDay.time as unknown as IWorkingTime;

    const workingStart = dayLib(date)
      .startOf('day')
      .add(workingTime.start, 'm');
    const workingEnd = dayLib(date).startOf('day').add(workingTime.end, 'm');

    if (
      dayLib(date).add(startTime, 'minute').isBefore(workingStart) ||
      dayLib(date).add(endTime, 'minute').isAfter(workingEnd)
    ) {
      throw new AppError(
        'O horário solicitado está fora do horário de trabalho.',
      );
    }

    const conflictingBooking = await prismaClient.booking.findFirst({
      where: {
        professionalId,
        date: dateDay.toDate(),
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
        status: 'CONFIRMED',
      },
    });

    if (conflictingBooking) {
      throw new AppError('O horário solicitado já está reservado.');
    }

    const booking = await prismaClient.booking.create({
      data: {
        date: dateDay.toDate(),
        endTime,
        startTime,
        clientId,
        forPersonName,
        professionalId,
        publicId,
        services: { createMany: { data: services } },
      },
      include: {
        client: true,
        services: { select: { service: true, price: true, order: true } },
      },
    });

    const startDateTime = dateDay.add(startTime, 'm');
    const customerName = capitalizeFirstName(booking.client.name.trim());

    const [messageConfirmed, messageRemember] = await Promise.all([
      this.generateMsgType(
        publicId,
        customerName,
        startDateTime,
        booking.services,
        forPersonName,
      ),
      this.generateMsgType(
        publicId,
        customerName,
        startDateTime,
        booking.services,
        undefined,
        'REMEMBER_BOOKING',
      ),
    ]);

    const scheduledTimeRemember = startDateTime.add(-30, 'minute');

    const pool = Database.getPool();

    await Promise.all([
      prismaClient.notificationQueue.create({
        data: {
          clientId: this.clientId,
          chatId: booking.client.email,
          message: messageConfirmed,
          bookingId: booking.id,
        },
      }),
      insertIntoTable(pool, 'notification_queue', {
        client_id: this.clientId,
        chat_id: booking.client.email,
        message: messageRemember,
        booking_id: booking.id,
        scheduled_time: scheduledTimeRemember.format('YYYY-MM-DD HH:mm:ss.SSS'),
      }),
      insertIntoTable(pool, 'notification_queue', {
        client_id: this.clientId,
        chat_id: booking.client.email,
        message: '⬇️ PIX ⬇️',
        booking_id: booking.id,
        scheduled_time: scheduledTimeRemember
          .add(3, 'second')
          .format('YYYY-MM-DD HH:mm:ss.SSS'),
      }),
      insertIntoTable(pool, 'notification_queue', {
        client_id: this.clientId,
        chat_id: booking.client.email,
        message: '32.665.968/0001-23',
        booking_id: booking.id,
        scheduled_time: scheduledTimeRemember
          .add(6, 'second')
          .format('YYYY-MM-DD HH:mm:ss.SSS'),
      }),
    ]);

    return {
      result: booking,
    };
  }

  private async generateDbMsg(
    name: string,
    objFormat?: IDataDict,
  ): Promise<string> {
    let template = '';
    const resultTemplate = await prismaClient.messageTemplate.findUnique({
      where: { name },
    });
    if (resultTemplate) {
      if (objFormat) {
        template = resultTemplate.body.replace(/{(\w+)}/g, (_, match) => {
          return objFormat[match] || '';
        });
      } else {
        template = resultTemplate.body;
      }
    }

    return template.replace(/\\n/g, '\n');
  }

  private async generateMsgType(
    publicId: string,
    customerName: string,
    startDateTime: Dayjs,
    services: {
      price: number;
      service: {
        name: string;
      };
    }[],
    forPersonName?: string,
    type = 'CONFIRMED',
  ): Promise<string> {
    let serviceList = '';
    let totalPrice = 0;

    services.forEach((service) => {
      serviceList += `- _${service.service.name}_: ${service.price.toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL',
        },
      )}\n`;
      totalPrice += service.price;
    });

    serviceList += `Total: *${totalPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}*`;

    let template = '';

    if (type === 'CONFIRMED') {
      const objFormat: {
        public_id: string;
        nome_cliente: string;
        data: string;
        total_servico: string;
        servicos: string;
        nome_pessoa?: string;
      } = {
        public_id: publicId,
        nome_cliente: customerName,
        data: getFormattedDate(startDateTime),
        total_servico:
          services.length > 1 ? 'Serviços agendados' : 'Serviço agendado',
        servicos: serviceList,
      };

      template = await this.generateDbMsg(this.templateName.new, objFormat);

      if (forPersonName) {
        objFormat.nome_pessoa = capitalizeFirstName(forPersonName.trim());
        template = await this.generateDbMsg(
          this.templateName.new_person,
          objFormat,
        );
      }
    } else {
      const objFormat = {
        nome_cliente: customerName,
        minutes: 30,
        hour: startDateTime.format('HH:mm'),
        value: totalPrice.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      };

      template = await this.generateDbMsg(type, objFormat);
    }

    return template;
  }
}
