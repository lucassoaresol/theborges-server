import { CreateOperatingHourUseCase } from '../../application/useCases/operatingHours/CreateOperatingHourUseCase';

export function makeCreateOperatingHourUseCase() {
  return new CreateOperatingHourUseCase();
}
