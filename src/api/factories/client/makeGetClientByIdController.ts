import { GetClientByIdController } from '../../application/controllers/client/GetClientByIdController.js';

import { makeGetClientByIdUseCase } from './makeGetClientByIdUseCase.js';

export function makeGetClientByIdController() {
  const getClientByIdUseCase = makeGetClientByIdUseCase();

  return new GetClientByIdController(getClientByIdUseCase);
}
