import { prismaClient } from '../../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  id: number;
}

interface IOutput {
  result: {
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
    bookingCart: {
      id: number;
      selectedDate: Date | null;
      startTime: number | null;
      endTime: number | null;
      professionalId: number | null;
      clientId: number;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  };
}

export class GetClientByIdUseCase {
  async execute({ id }: IInput): Promise<IOutput> {
    const client = await prismaClient.client.findUnique({
      where: { id },
      include: { bookingCart: true },
    });

    if (!client) {
      throw new AppError('');
    }

    return {
      result: client,
    };
  }
}
