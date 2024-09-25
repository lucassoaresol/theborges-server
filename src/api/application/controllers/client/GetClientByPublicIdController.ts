import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { GetClientByPublicIdUseCase } from '../../useCases/client/GetClientByPublicIdUseCase';

export class GetClientByPublicIdController implements IController {
  constructor(
    private readonly getClientByPublicIdUseCase: GetClientByPublicIdUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.getClientByPublicIdUseCase.execute({
      publicId: params.id,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
