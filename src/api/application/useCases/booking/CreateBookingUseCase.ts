import { Dayjs } from 'dayjs';

import { createMessage } from '../../../../libs/axiosWPP';
import dayLib from '../../../../libs/dayjs';
import { prismaClient } from '../../../../libs/prismaClient';
import { PublicIdGenerator } from '../../../../services/PublicIdGenerator';
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
  ) { }

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
    const customerName = this.capitalizeFirstName(booking.client.name.trim());
    const formattedDate = this.getFormattedDate(startDateTime);

    const message = await this.generateDbMsg(
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
      serviceList += `- _${service.service.name}_: R$ ${service.price.toFixed(2)}\n`;
      totalPrice += service.price;
    });

    serviceList += `Total: *R$ ${totalPrice.toFixed(2)}*`;

    const objFormat: {
      nome_cliente: string;
      data: string;
      total_servico: string;
      servicos: string;
      nome_pessoa?: string;
    } = {
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
      objFormat.nome_pessoa = this.capitalizeFirstName(forPersonName.trim());
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

  private async generateUniquePublicId(length: number = 5): Promise<string> {
    const allowedCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let publicId = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(
          Math.random() * allowedCharacters.length,
        );
        publicId += allowedCharacters[randomIndex];
      }

      const existingId = await prismaClient.booking.findUnique({
        where: { publicId },
      });

      if (!existingId) {
        return publicId;
      }
    }

    throw new AppError(
      'Não foi possível gerar um ID único após várias tentativas',
    );
  }
}
