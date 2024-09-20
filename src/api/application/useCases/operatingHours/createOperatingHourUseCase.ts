import { prismaClient } from '../../../../libs/prismaClient';

interface IInput {
  dayOfWeek: number;
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

type IOutput = void;

export class CreateOperatingHourUseCase {
  async execute({ breaks, dayOfWeek, end, start }: IInput): Promise<IOutput> {
    await prismaClient.operatingHours.create({
      data: { dayOfWeek, time: { start: start, end: end, breaks: breaks } },
    });
  }
}
