import { UpdateClientUseCase } from '../../application/useCases/client/UpdateClientUseCase';

export function makeUpdateClientUseCase() {
  return new UpdateClientUseCase();
}
