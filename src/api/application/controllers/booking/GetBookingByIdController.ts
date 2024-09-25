import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { GetBookingByIdUseCase } from '../../useCases/booking/GetBookingByIdUseCase';

export class GetBookingByIdController implements IController {
  constructor(private readonly getBookingByIdUseCase: GetBookingByIdUseCase) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.getBookingByIdUseCase.execute({
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
