import { ListOperatingHourUseCase } from '../../application/useCases/operatingHours/ListOperatingHourUseCase.js';

export function makeListOperatingHourUseCase() {
  return new ListOperatingHourUseCase();
}
