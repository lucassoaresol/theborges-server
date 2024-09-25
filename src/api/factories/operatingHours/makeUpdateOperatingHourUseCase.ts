import { UpdateOperatingHourUseCase } from '../../application/useCases/operatingHours/UpdateOperatingHourUseCase';

export function makeUpdateOperatingHourUseCase() {
  return new UpdateOperatingHourUseCase();
}
