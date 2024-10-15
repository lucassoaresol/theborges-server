import { GetClientByPhoneController } from '../../application/controllers/client/GetClientByPhoneController';

import { makeGetClientByPhoneUseCase } from './makeGetClientByPhoneUseCase';

export function makeGetClientByPhoneController() {
  const getClientByPhoneUseCase = makeGetClientByPhoneUseCase();

  return new GetClientByPhoneController(getClientByPhoneUseCase);
}
