import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { UpdateBookingUseCase } from '../../useCases/booking/UpdateBookingUseCase';

const schema = z.object({
  status: z
    .enum(['CANCELLED', 'COMPLETED', 'RESCHEDULED', 'NO_SHOW'])
    .optional(),
  forPersonName: z.string().optional(),
});

export class UpdateBookingController implements IController {
  constructor(private readonly updateBookingUseCase: UpdateBookingUseCase) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    const { status, forPersonName } = schema.parse(body);

    const { result } = await this.updateBookingUseCase.execute({
      id: Number(params.id),
      forPersonName,
      status,
    });

    return {
      statusCode: 200,
      body: { result },
    };
  }
}
