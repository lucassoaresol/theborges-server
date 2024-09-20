import { IController, IResponse } from '../../interfaces/IController';
import { ListOperatingHourUseCase } from '../../useCases/operatingHours/ListOperatingHourUseCase';

export class ListOperatingHourController implements IController {
  constructor(
    private readonly listOperatingHourUseCase: ListOperatingHourUseCase,
  ) {}

  async handle(): Promise<IResponse> {
    const body = await this.listOperatingHourUseCase.execute();

    return {
      statusCode: 200,
      body,
    };
  }
}
