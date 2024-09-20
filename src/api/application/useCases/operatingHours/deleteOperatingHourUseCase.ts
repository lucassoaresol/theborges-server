import { prismaClient } from '../../../../libs/prismaClient';

interface IInput {
  id: number;
}

type IOutput = void;

export class DeleteOperatingHourUseCase {
  async execute({ id }: IInput): Promise<IOutput> {
    await prismaClient.operatingHours.delete({
      where: { id },
    });
  }
}
