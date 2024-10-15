import { GetServiceController } from '../../application/controllers/service/GetServiceController';

import { makeGetServiceUseCase } from './makeGetServiceUseCase';

export function makeGetServiceController() {
  const getServiceUseCase = makeGetServiceUseCase();

  return new GetServiceController(getServiceUseCase);
}
