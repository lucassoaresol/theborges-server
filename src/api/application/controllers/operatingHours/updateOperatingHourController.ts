import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { UpdateOperatingHourUseCase } from '../../useCases/operatingHours/UpdateOperatingHourUseCase';

const schema = z.object({
  start: z.number().positive(),
  end: z.number().positive(),
  breaks: z
    .object({
      start: z.number().positive(),
      end: z.number().positive(),
    })
    .array(),
});

export class UpdateOperatingHourController implements IController {
  constructor(
    private readonly updateOperatingHourUseCase: UpdateOperatingHourUseCase,
  ) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    const { breaks, end, start } = schema.parse(body);

    await this.updateOperatingHourUseCase.execute({
      id: Number(params.id),
      breaks,
      end,
      start,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
