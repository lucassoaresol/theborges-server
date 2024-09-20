import { UpdateOperatingHourUseCase } from '../../application/useCases/operatingHours/updateOperatingHourUseCase.js';

export function makeUpdateOperatingHourUseCase() {
  return new UpdateOperatingHourUseCase();
}
