import { z } from 'zod';

import dayLib from '../../../../libs/dayjs';
import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { GetWorkingDayUseCase } from '../../useCases/workingDay/GetWorkingDayUseCase';

const schema = z.object({
  date: z
    .string()
    .optional()
    .refine((val) => dayLib(val, 'YYYY-MM-DD', true).isValid(), {
      message: 'Formato de data inválido. Use "YYYY-MM-DD".',
    }),
  professionalId: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = parseInt(val ?? '', 10);
      return isNaN(parsed) ? undefined : parsed;
    }),
});

export class GetWorkingDayController implements IController {
  constructor(private readonly getWorkingDayUseCase: GetWorkingDayUseCase) {}

  async handle({ query, accountId }: IRequest): Promise<IResponse> {
    const safeQuery = query || {};

    const { date, professionalId } = schema.parse(safeQuery);

    const { result } = await this.getWorkingDayUseCase.execute({
      date,
      professionalId,
      isAuth: !!accountId,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
