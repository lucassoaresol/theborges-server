import { GetClientByPublicIdController } from '../../application/controllers/client/GetClientByPublicIdController';

import { makeGetClientByPublicIdUseCase } from './makeGetClientByPublicIdUseCase';

export function makeGetClientByPublicIdController() {
  const getClientByPublicIdUseCase = makeGetClientByPublicIdUseCase();

  return new GetClientByPublicIdController(getClientByPublicIdUseCase);
}
