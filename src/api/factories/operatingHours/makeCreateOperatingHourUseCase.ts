import { CreateOperatingHourUseCase } from '../../application/useCases/operatingHours/createOperatingHourUseCase';

export function makeCreateOperatingHourUseCase() {
  return new CreateOperatingHourUseCase();
}
