import { z } from 'zod';

import dayLib from '../../../../libs/dayjs';
import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { UpdateWorkingDayUseCase } from '../../useCases/workingDay/UpdateWorkingDayUseCase';

const schema = z.object({
  date: z.string().refine((val) => dayLib(val, 'YYYY-MM-DD', true).isValid(), {
    message: 'Formato de data inválido. Use "YYYY-MM-DD".',
  }),
  professionalId: z.number().positive(),
  start: z.number().positive(),
  end: z.number().positive().optional(),
});

export class UpdateWorkingDayController implements IController {
  constructor(
    private readonly updateWorkingDayUseCase: UpdateWorkingDayUseCase,
  ) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { date, professionalId, start, end } = schema.parse(body);

    await this.updateWorkingDayUseCase.execute({
      date,
      professionalId,
      start,
      end,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
