import { IController, IResponse } from '../../interfaces/IController';
import { GetCategoryUseCase } from '../../useCases/category/GetCategoryUseCase';

export class GetCategoryController implements IController {
  constructor(private readonly getCategoryUseCase: GetCategoryUseCase) {}

  async handle(): Promise<IResponse> {
    const { result } = await this.getCategoryUseCase.execute();

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
