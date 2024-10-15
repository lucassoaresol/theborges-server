import { GetCategoryController } from '../../application/controllers/category/GetCategoryController';

import { makeGetCategoryUseCase } from './makeGetCategoryUseCase';

export function makeGetCategoryController() {
  const getCategoryUseCase = makeGetCategoryUseCase();

  return new GetCategoryController(getCategoryUseCase);
}
