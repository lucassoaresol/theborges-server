import { GetServiceController } from '../../application/controllers/service/GetServiceController.js';

import { makeGetServiceUseCase } from './makeGetServiceUseCase.js';

export function makeGetServiceController() {
  const getServiceUseCase = makeGetServiceUseCase();

  return new GetServiceController(getServiceUseCase);
}
