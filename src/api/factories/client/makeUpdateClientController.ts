import { UpdateClientController } from '../../application/controllers/client/UpdateClientController';

import { makeUpdateClientUseCase } from './makeUpdateClientUseCase';

export function makeUpdateClientController() {
  const updateClientUseCase = makeUpdateClientUseCase();

  return new UpdateClientController(updateClientUseCase);
}
