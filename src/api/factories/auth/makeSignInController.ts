import { SignInController } from '../../application/controllers/auth/SignInController';

import { makeSignInUseCase } from './makeSignInUseCase';

export function makeSignInController() {
  const signInUseCase = makeSignInUseCase();

  return new SignInController(signInUseCase);
}
