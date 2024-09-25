import { GetClientByIdUseCase } from '../../application/useCases/client/GetClientByIdUseCase';

export function makeGetClientByIdUseCase() {
  return new GetClientByIdUseCase();
}
