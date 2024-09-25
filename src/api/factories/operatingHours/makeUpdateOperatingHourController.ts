import { UpdateOperatingHourController } from '../../application/controllers/operatingHours/UpdateOperatingHourController.js';

import { makeUpdateOperatingHourUseCase } from './makeUpdateOperatingHourUseCase.js';

export function makeUpdateOperatingHourController() {
  const updateOperatingHourUseCase = makeUpdateOperatingHourUseCase();

  return new UpdateOperatingHourController(updateOperatingHourUseCase);
}
