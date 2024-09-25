import { IController, IResponse } from '../../interfaces/IController';
import { GetOperatingHourUseCase } from '../../useCases/operatingHours/GetOperatingHourUseCase';

export class GetOperatingHourController implements IController {
  constructor(
    private readonly getOperatingHourUseCase: GetOperatingHourUseCase,
  ) {}

  async handle(): Promise<IResponse> {
    const body = await this.getOperatingHourUseCase.execute();

    return {
      statusCode: 200,
      body,
    };
  }
}
