import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { RetrieveBookingUseCase } from '../../useCases/booking/RetrieveBookingUseCase';

export class RetrieveBookingController implements IController {
  constructor(
    private readonly retrieveBookingUseCase: RetrieveBookingUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.retrieveBookingUseCase.execute({
      key: params.id,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
