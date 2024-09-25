import { GetClientByPublicIdUseCase } from '../../application/useCases/client/GetClientByPublicIdUseCase';

export function makeGetClientByPublicIdUseCase() {
  return new GetClientByPublicIdUseCase();
}
