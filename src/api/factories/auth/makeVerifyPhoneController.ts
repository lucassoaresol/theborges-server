import { VerifyPhoneController } from '../../application/controllers/auth/VerifyPhoneController';

import { makeVerifyPhoneUseCase } from './makeVerifyPhoneUseCase';

export function makeVerifyPhoneController() {
  const verifyPhoneUseCase = makeVerifyPhoneUseCase();

  return new VerifyPhoneController(verifyPhoneUseCase);
}
