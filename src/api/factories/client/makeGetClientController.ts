import { GetClientController } from '../../application/controllers/client/GetClientController';

import { makeGetClientUseCase } from './makeGetClientUseCase';

export function makeGetClientController() {
  const getClientUseCase = makeGetClientUseCase();

  return new GetClientController(getClientUseCase);
}
