import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { ListClientUseCase } from '../../useCases/client/ListClientUseCase';

const schema = z.object({
  search: z.string().optional(),
  wantsPromotions: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined; // Se não for 'true' ou 'false', considerar undefined
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = parseInt(val ?? '', 10); // Se val for undefined ou string vazia, retorna NaN
      return isNaN(parsed) ? undefined : parsed; // Converte para número ou retorna undefined
    }),
  skip: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = parseInt(val ?? '', 10); // Se val for undefined ou string vazia, retorna NaN
      return isNaN(parsed) ? undefined : parsed; // Converte para número ou retorna undefined
    }),
});

export class ListClientController implements IController {
  constructor(private readonly listClientUseCase: ListClientUseCase) {}

  async handle({ query }: IRequest): Promise<IResponse> {
    const safeQuery = query || {};

    const { search, wantsPromotions, limit, skip } = schema.parse(safeQuery);

    const { result, hasMore } = await this.listClientUseCase.execute({
      search,
      wantsPromotions,
      limit,
      skip,
    });

    return {
      statusCode: 200,
      body: {
        result,
        hasMore,
      },
    };
  }
}
