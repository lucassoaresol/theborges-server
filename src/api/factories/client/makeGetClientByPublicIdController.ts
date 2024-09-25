import { GetClientByPublicIdController } from '../../application/controllers/client/GetClientByPublicIdController.js';

import { makeGetClientByPublicIdUseCase } from './makeGetClientByPublicIdUseCase.js';

export function makeGetClientByPublicIdController() {
  const getClientByPublicIdUseCase = makeGetClientByPublicIdUseCase();

  return new GetClientByPublicIdController(getClientByPublicIdUseCase);
}
