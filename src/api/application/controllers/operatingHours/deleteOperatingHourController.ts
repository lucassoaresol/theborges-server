import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { DeleteOperatingHourUseCase } from '../../useCases/operatingHours/deleteOperatingHourUseCase';

export class DeleteOperatingHourController implements IController {
  constructor(
    private readonly deleteOperatingHourUseCase: DeleteOperatingHourUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    await this.deleteOperatingHourUseCase.execute({
      id: Number(params.id),
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
