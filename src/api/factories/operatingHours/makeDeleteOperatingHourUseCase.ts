import { DeleteOperatingHourUseCase } from '../../application/useCases/operatingHours/deleteOperatingHourUseCase.js';

export function makeDeleteOperatingHourUseCase() {
  return new DeleteOperatingHourUseCase();
}
