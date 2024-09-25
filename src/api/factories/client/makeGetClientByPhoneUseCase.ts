import { GetClientByPhoneUseCase } from '../../application/useCases/client/GetClientByPhoneUseCase';

export function makeGetClientByPhoneUseCase() {
  return new GetClientByPhoneUseCase();
}
