import { GetClientController } from '../../application/controllers/client/GetClientController.js';

import { makeGetClientUseCase } from './makeGetClientUseCase.js';

export function makeGetClientController() {
  const getClientUseCase = makeGetClientUseCase();

  return new GetClientController(getClientUseCase);
}
