import { VerifyPhoneUseCase } from '../../application/useCases/auth/VerifyPhoneUseCase';

export function makeVerifyPhoneUseCase() {
  return new VerifyPhoneUseCase();
}
