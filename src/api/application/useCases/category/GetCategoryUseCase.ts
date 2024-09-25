import { prismaClient } from '../../../../libs/prismaClient';

interface IOutput {
  result: {
    id: number;
    name: string;
    color: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export class GetCategoryUseCase {
  async execute(): Promise<IOutput> {
    const categories = await prismaClient.category.findMany();

    return {
      result: categories,
    };
  }
}
