import { prismaClient } from '../../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  publicId: string;
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

export class GetBookingByPublicIdUseCase {
  async execute({ publicId }: IInput): Promise<IOutput> {
    const booking = await prismaClient.booking.findUnique({
      where: { publicId },
      include: {
        client: true,
        services: { select: { service: true, price: true, order: true } },
      },
    });

    if (!booking) {
      throw new AppError('');
    }

    return {
      result: booking,
    };
  }
}
