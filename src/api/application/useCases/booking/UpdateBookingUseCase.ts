import { Dayjs } from 'dayjs';

import { avisos, createMessage } from '../../../../libs/axiosWPP';
import dayLib from '../../../../libs/dayjs';
import { prismaClient } from '../../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  id: number;
  forPersonName?: string;
  status?: 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED';
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
    wasReminded: boolean;
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

export class UpdateBookingUseCase {
  constructor(private readonly templateName: string) {}

  async execute({ id, forPersonName, status }: IInput): Promise<IOutput> {
    try {
      const booking = await prismaClient.booking.update({
        where: { id },
        data: {
          forPersonName,
          status,
        },
        include: {
          client: true,
          services: { select: { service: true, price: true, order: true } },
        },
      });

      if (status === 'CANCELLED') {
        const startDateTime = dayLib(booking.date)
          .startOf('day')
          .add(booking.startTime, 'm');
        const customerName = this.capitalizeFirstName(
          booking.client.name.trim(),
        );
        const formattedDate = this.getFormattedDate(startDateTime);

        const message = await this.generateDbMsg(
          booking.client.publicId,
          customerName,
          formattedDate,
        );

        await Promise.all([
          createMessage({ message, number: booking.client.email }),
          avisos({
            message: `*Aviso de Horário Vago*

Motivo: Cliente cancelou
Cliente: ${customerName}
Horário disponível: ${formattedDate}`,
          }),
        ]);
      }

      if (status === 'RESCHEDULED') {
        const startDateTime = dayLib(booking.date)
          .startOf('day')
          .add(booking.startTime, 'm');
        const customerName = this.capitalizeFirstName(
          booking.client.name.trim(),
        );
        const formattedDate = this.getFormattedDate(startDateTime);

        await avisos({
          message: `*Aviso de Horário Vago*

Motivo: Cliente reagendou
Cliente: ${customerName}
Horário disponível: ${formattedDate}`,
        });
      }

      return { result: booking };
    } catch {
      throw new AppError('');
    }
  }

  private capitalizeFirstName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .shift() as string;
  }

  private getFormattedDate(startDateTime: Dayjs): string {
    const now = dayLib();

    if (startDateTime.isSame(now, 'day')) {
      return `hoje às ${startDateTime.format('HH:mm')}`;
    } else if (startDateTime.isSame(now.add(1, 'day'), 'day')) {
      return `amanhã às ${startDateTime.format('HH:mm')}`;
    } else if (startDateTime.diff(now, 'day') <= 6) {
      return `${startDateTime.format('dddd')} às ${startDateTime.format('HH:mm')}`;
    } else {
      return `${startDateTime.format('DD/MM/YYYY')} às ${startDateTime.format('HH:mm')}`;
    }
  }

  private async generateDbMsg(
    publicId: string,
    customerName: string,
    formattedDate: string,
  ): Promise<string> {
    const objFormat = {
      public_id: publicId,
      nome_cliente: customerName,
      data: formattedDate,
    };

    let template = '';

    const resultTemplate = await prismaClient.messageTemplate.findUnique({
      where: { name: this.templateName },
    });

    if (resultTemplate) {
      template = resultTemplate.body.replace(
        /{(\w+)}/g,
        (_, match: keyof typeof objFormat) => {
          return objFormat[match] || '';
        },
      );
    }

    return template.replace(/\\n/g, '\n');
  }
}
