import { UpdateClientController } from '../../application/controllers/client/UpdateClientController.js';

import { makeUpdateClientUseCase } from './makeUpdateClientUseCase.js';

export function makeUpdateClientController() {
  const updateClientUseCase = makeUpdateClientUseCase();

  return new UpdateClientController(updateClientUseCase);
}
