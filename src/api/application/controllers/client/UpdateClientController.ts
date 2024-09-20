import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { UpdateClientUseCase } from '../../useCases/client/UpdateClientUseCase';

const schema = z.object({
  id: z.string().transform((val) => {
    const parsed = parseInt(val ?? '', 10); // Se val for undefined ou string vazia, retorna NaN
    return isNaN(parsed) ? 0 : parsed; // Converte para número ou retorna undefined
  }),
  name: z.string().optional(),
  phone: z.string().optional(),
  birthDay: z.number().optional(),
  birthMonth: z.number().optional(),
  wantsPromotions: z.boolean().optional(),
});

export class UpdateClientController implements IController {
  constructor(private readonly updateClientUseCase: UpdateClientUseCase) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    const { id, name, phone, wantsPromotions, birthDay, birthMonth } =
      schema.parse({ ...body, id: params.id });

    const { result } = await this.updateClientUseCase.execute({
      id,
      birthDay,
      birthMonth,
      name,
      phone,
      wantsPromotions,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}
