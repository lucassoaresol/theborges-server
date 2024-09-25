import { GetClientByPhoneController } from '../../application/controllers/client/GetClientByPhoneController.js';

import { makeGetClientByPhoneUseCase } from './makeGetClientByPhoneUseCase.js';

export function makeGetClientByPhoneController() {
  const getClientByPhoneUseCase = makeGetClientByPhoneUseCase();

  return new GetClientByPhoneController(getClientByPhoneUseCase);
}
