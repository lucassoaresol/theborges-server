import { GetOperatingHourUseCase } from '../../application/useCases/operatingHours/GetOperatingHourUseCase';

export function makeGetOperatingHourUseCase() {
  return new GetOperatingHourUseCase();
}
