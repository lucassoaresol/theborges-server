import dayLib from '../../../../libs/dayjs';
import { prismaClient } from '../../../../libs/prismaClient';
import { capitalizeFirstName } from '../../../../utils/capitalizeFirstName';
import { getFormattedDate } from '../../../../utils/getFormattedDate';
import { AppError } from '../../errors/appError';

interface IInput {
  id: number;
  forPersonName?: string;
  status?: 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED' | 'NO_SHOW';
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

export class UpdateBookingUseCase {
  constructor(
    private clientId: string,
    private readonly templateName: string,
  ) {}

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
        const customerName = capitalizeFirstName(booking.client.name.trim());
        const formattedDate = getFormattedDate(startDateTime);

        const [message] = await Promise.all([
          this.generateDbMsg(
            booking.client.publicId,
            customerName,
            formattedDate,
          ),
          prismaClient.notificationQueue.updateMany({
            where: {
              bookingId: id,
              OR: [{ status: 'FAILED' }, { status: 'PENDING' }],
            },
            data: { status: 'CANCELLED' },
          }),
        ]);

        await Promise.all([
          prismaClient.notificationQueue.create({
            data: {
              clientId: this.clientId,
              chatId: booking.client.email,
              message,
              bookingId: booking.id,
            },
          }),
          prismaClient.notificationQueue.create({
            data: {
              clientId: 'monitoramento',
              chatId: '120363307872837951@g.us',
              message: `*Aviso de Horário Vago*

Motivo: Cliente cancelou
Cliente: ${customerName}
Horário disponível: ${formattedDate}`,
              bookingId: booking.id,
            },
          }),
        ]);
      }

      if (status === 'RESCHEDULED') {
        const startDateTime = dayLib(booking.date)
          .startOf('day')
          .add(booking.startTime, 'm');
        const customerName = capitalizeFirstName(booking.client.name.trim());
        const formattedDate = getFormattedDate(startDateTime);

        await Promise.all([
          prismaClient.notificationQueue.updateMany({
            where: {
              bookingId: id,
              OR: [{ status: 'FAILED' }, { status: 'PENDING' }],
            },
            data: { status: 'CANCELLED' },
          }),
          prismaClient.notificationQueue.create({
            data: {
              clientId: 'monitoramento',
              chatId: '120363307872837951@g.us',
              message: `*Aviso de Horário Vago*

Motivo: Cliente reagendou
Cliente: ${customerName}
Horário disponível: ${formattedDate}`,
              bookingId: booking.id,
            },
          }),
        ]);
      }

      return { result: booking };
    } catch {
      throw new AppError('');
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
