import { GetOperatingHourUseCase } from '../../application/useCases/operatingHours/GetOperatingHourUseCase.js';

export function makeGetOperatingHourUseCase() {
  return new GetOperatingHourUseCase();
}
