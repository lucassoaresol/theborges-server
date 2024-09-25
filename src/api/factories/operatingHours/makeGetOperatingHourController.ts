import { GetOperatingHourController } from '../../application/controllers/operatingHours/GetOperatingHourController.js';

import { makeGetOperatingHourUseCase } from './makeGetOperatingHourUseCase.js';

export function makeGetOperatingHourController() {
  const getOperatingHourUseCase = makeGetOperatingHourUseCase();

  return new GetOperatingHourController(getOperatingHourUseCase);
}
