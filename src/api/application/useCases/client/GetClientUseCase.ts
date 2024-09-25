import { prismaClient } from '../../../../libs/prismaClient';

interface IInput {
  search?: string;
  wantsPromotions?: boolean;
  limit?: number;
  skip?: number;
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
  }[];
  hasMore: boolean;
}

export class GetClientUseCase {
  async execute({
    limit,
    search,
    skip,
    wantsPromotions,
  }: IInput): Promise<IOutput> {
    limit = limit || 20;
    skip = skip || 0;

    const filterConditions = this.buildFilterConditions(
      search,
      wantsPromotions,
    );

    const [clients, totalClients] = await Promise.all([
      prismaClient.client.findMany({
        where: filterConditions,
        orderBy: { name: 'asc' },
        skip: skip,
        take: limit,
      }),
      prismaClient.client.count(),
    ]);

    return {
      result: clients,
      hasMore: skip + limit < totalClients,
    };
  }

  private buildFilterConditions(search?: string, wantsPromotions?: boolean) {
    const filterConditions: any = {};
    if (search) {
      filterConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (wantsPromotions !== undefined) {
      filterConditions.wantsPromotions = wantsPromotions;
    }

    return filterConditions;
  }
}
