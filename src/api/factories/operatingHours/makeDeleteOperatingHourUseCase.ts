import { DeleteOperatingHourUseCase } from '../../application/useCases/operatingHours/deleteOperatingHourUseCase';

export function makeDeleteOperatingHourUseCase() {
  return new DeleteOperatingHourUseCase();
}
