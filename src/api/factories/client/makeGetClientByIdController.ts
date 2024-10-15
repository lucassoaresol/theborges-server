import { GetClientByIdController } from '../../application/controllers/client/GetClientByIdController';

import { makeGetClientByIdUseCase } from './makeGetClientByIdUseCase';

export function makeGetClientByIdController() {
  const getClientByIdUseCase = makeGetClientByIdUseCase();

  return new GetClientByIdController(getClientByIdUseCase);
}
