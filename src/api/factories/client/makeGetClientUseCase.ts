import { GetClientUseCase } from '../../application/useCases/client/GetClientUseCase';

export function makeGetClientUseCase() {
  return new GetClientUseCase();
}
