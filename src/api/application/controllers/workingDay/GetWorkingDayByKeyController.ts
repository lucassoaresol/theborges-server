import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { GetWorkingDayByKeyUseCase } from '../../useCases/workingDay/GetWorkingDayByKeyUseCase';

export class GetWorkingDayByKeyController implements IController {
  constructor(
    private readonly getWorkingDayByKeyUseCase: GetWorkingDayByKeyUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.getWorkingDayByKeyUseCase.execute({
      key: Number(params.id),
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
