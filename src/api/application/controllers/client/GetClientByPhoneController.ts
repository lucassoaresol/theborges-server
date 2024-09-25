import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { GetClientByPhoneUseCase } from '../../useCases/client/GetClientByPhoneUseCase';

export class GetClientByPhoneController implements IController {
  constructor(
    private readonly getClientByPhoneUseCase: GetClientByPhoneUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.getClientByPhoneUseCase.execute({
      phone: params.id,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
