import { CreateOperatingHourUseCase } from '../../application/useCases/operatingHours/createOperatingHourUseCase.js';

export function makeCreateOperatingHourUseCase() {
  return new CreateOperatingHourUseCase();
}
