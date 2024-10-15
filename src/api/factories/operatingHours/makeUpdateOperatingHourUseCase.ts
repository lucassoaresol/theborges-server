import { UpdateOperatingHourUseCase } from '../../application/useCases/operatingHours/updateOperatingHourUseCase';

export function makeUpdateOperatingHourUseCase() {
  return new UpdateOperatingHourUseCase();
}
