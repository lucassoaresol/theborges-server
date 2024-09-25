import { DeleteOperatingHourUseCase } from '../../application/useCases/operatingHours/DeleteOperatingHourUseCase';

export function makeDeleteOperatingHourUseCase() {
  return new DeleteOperatingHourUseCase();
}
