import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { GetClientByIdUseCase } from '../../useCases/client/GetClientByIdUseCase';

export class GetClientByIdController implements IController {
  constructor(private readonly getClientByIdUseCase: GetClientByIdUseCase) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.getClientByIdUseCase.execute({
      id: parseInt(params.id),
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
