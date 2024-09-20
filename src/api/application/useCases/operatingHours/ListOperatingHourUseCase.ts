import { JsonValue } from '@prisma/client/runtime/library';

import { prismaClient } from '../../../../libs/prismaClient';

interface IOutput {
  result: {
    id: number;
    dayOfWeek: number;
    time: JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export class ListOperatingHourUseCase {
  async execute(): Promise<IOutput> {
    const result = await prismaClient.operatingHours.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

    return {
      result,
    };
  }
}
