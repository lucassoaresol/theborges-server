import { UpdateOperatingHourController } from '../../application/controllers/operatingHours/updateOperatingHourController.js';

import { makeUpdateOperatingHourUseCase } from './makeUpdateOperatingHourUseCase.js';

export function makeUpdateOperatingHourController() {
  const updateOperatingHourUseCase = makeUpdateOperatingHourUseCase();

  return new UpdateOperatingHourController(updateOperatingHourUseCase);
}
