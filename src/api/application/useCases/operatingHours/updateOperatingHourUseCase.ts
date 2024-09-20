import { prismaClient } from '../../../../libs/prismaClient';

interface IInput {
  id: number;
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

type IOutput = void;

export class UpdateOperatingHourUseCase {
  async execute({ id, breaks, end, start }: IInput): Promise<IOutput> {
    await prismaClient.operatingHours.update({
      data: { time: { start: start, end: end, breaks: breaks } },
      where: { id },
    });
  }
}
