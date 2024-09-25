import { GetCategoryUseCase } from '../../application/useCases/category/GetCategoryUseCase';

export function makeGetCategoryUseCase() {
  return new GetCategoryUseCase();
}
