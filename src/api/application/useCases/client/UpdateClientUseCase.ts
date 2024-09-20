import { verifyNumber } from '../../../../libs/axiosWPP';
import { prismaClient } from '../../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  id: number;
  name?: string;
  phone?: string;
  birthDay?: number;
  birthMonth?: number;
  wantsPromotions?: boolean;
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
  };
}

export class UpdateClientUseCase {
  async execute({
    id,
    birthDay,
    birthMonth,
    name,
    phone,
    wantsPromotions,
  }: IInput): Promise<IOutput> {
    try {
      let email = undefined;
      if (phone) {
        const resultPhone = await verifyNumber(phone);

        if (!resultPhone) {
          throw new AppError('');
        }

        email = resultPhone._serialized;
      }

      const client = await prismaClient.client.update({
        where: { id },
        data: {
          email,
          name,
          phone,
          birthDay,
          birthMonth,
          wantsPromotions,
        },
      });

      return { result: client };
    } catch {
      throw new AppError('');
    }
  }
}
