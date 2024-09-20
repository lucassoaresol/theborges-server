import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { CreateOperatingHourUseCase } from '../../useCases/operatingHours/createOperatingHourUseCase';

const schema = z.object({
  dayOfWeek: z.number().positive(),
  start: z.number().positive(),
  end: z.number().positive(),
  breaks: z
    .object({
      start: z.number().positive(),
      end: z.number().positive(),
    })
    .array(),
});

export class CreateOperatingHourController implements IController {
  constructor(
    private readonly createOperatingHourUseCase: CreateOperatingHourUseCase,
  ) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { breaks, dayOfWeek, end, start } = schema.parse(body);

    await this.createOperatingHourUseCase.execute({
      breaks,
      dayOfWeek,
      end,
      start,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
