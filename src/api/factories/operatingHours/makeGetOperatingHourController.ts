import { GetOperatingHourController } from '../../application/controllers/operatingHours/GetOperatingHourController';

import { makeGetOperatingHourUseCase } from './makeGetOperatingHourUseCase';

export function makeGetOperatingHourController() {
  const getOperatingHourUseCase = makeGetOperatingHourUseCase();

  return new GetOperatingHourController(getOperatingHourUseCase);
}
