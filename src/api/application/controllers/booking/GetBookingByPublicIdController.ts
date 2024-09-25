import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { GetBookingByPublicIdUseCase } from '../../useCases/booking/GetBookingByPublicIdUseCase';

export class GetBookingByPublicIdController implements IController {
  constructor(
    private readonly getBookingByPublicIdUseCase: GetBookingByPublicIdUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.getBookingByPublicIdUseCase.execute({
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
