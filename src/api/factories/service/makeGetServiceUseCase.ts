import { GetServiceUseCase } from '../../application/useCases/service/GetServiceUseCase';

export function makeGetServiceUseCase() {
  return new GetServiceUseCase();
}
