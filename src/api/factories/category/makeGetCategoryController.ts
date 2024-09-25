import { GetCategoryController } from '../../application/controllers/category/GetCategoryController.js';

import { makeGetCategoryUseCase } from './makeGetCategoryUseCase.js';

export function makeGetCategoryController() {
  const getCategoryUseCase = makeGetCategoryUseCase();

  return new GetCategoryController(getCategoryUseCase);
}
