import { SignUpController } from '../../application/controllers/auth/SignUpController';

import { makeSignUpUseCase } from './makeSignUpUseCase';

export function makeSignUpController() {
  const signUpUseCase = makeSignUpUseCase();

  return new SignUpController(signUpUseCase);
}
