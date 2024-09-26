import { createMessage } from '../../../../libs/axiosWPP';
import dayLib from '../../../../libs/dayjs';
import { prismaClient } from '../../../../libs/prismaClient';
import { PublicIdGenerator } from '../../../../services/PublicIdGenerator';
import { capitalizeFirstName } from '../../../../utils/capitalizeFirstName';
import { getFormattedDate } from '../../../../utils/getFormattedDate';
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

interface IWorkingTime {
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

export class CreateBookingUseCase {
  constructor(
    private publicIdGenerator: PublicIdGenerator,
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
            startTime: { lt: endTime }, // Início do agendamento solicitado colide com outro (permitindo que o fim do outro seja igual ao startTime)
            endTime: { gt: startTime }, // Fim do agendamento solicitado colide com outro (permitindo que o início do outro seja igual ao endTime)
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
        wasReminded: true,
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
    const formattedDate = getFormattedDate(startDateTime);

    const message = await this.generateDbMsg(
      publicId,
      customerName,
      formattedDate,
      forPersonName,
      booking.services,
    );

    await createMessage({ message, number: booking.client.email });

    return {
      result: booking,
    };
  }

  private async generateDbMsg(
    publicId: string,
    customerName: string,
    formattedDate: string,
    forPersonName: string | undefined,
    services: {
      price: number;
      service: {
        name: string;
      };
    }[],
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
      data: formattedDate,
      total_servico:
        services.length > 1 ? 'Serviços agendados' : 'Serviço agendado',
      servicos: serviceList,
    };

    let template = '';

    let resultTemplate = await prismaClient.messageTemplate.findUnique({
      where: { name: this.templateName.new },
    });

    if (forPersonName) {
      resultTemplate = await prismaClient.messageTemplate.findUnique({
        where: { name: this.templateName.new_person },
      });
      objFormat.nome_pessoa = capitalizeFirstName(forPersonName.trim());
    }

    if (resultTemplate) {
      template = resultTemplate.body.replace(
        /{(\w+)}/g,
        (_: any, match: keyof typeof objFormat) => {
          return objFormat[match] || '';
        },
      );
    }

    return template.replace(/\\n/g, '\n');
  }
}
