import { CreateClientController } from '../../application/controllers/client/CreateClientController';

import { makeCreateClientUseCase } from './makeCreateClientUseCase';

export function makeCreateClientController() {
  const createClientUseCase = makeCreateClientUseCase();

  return new CreateClientController(createClientUseCase);
}
