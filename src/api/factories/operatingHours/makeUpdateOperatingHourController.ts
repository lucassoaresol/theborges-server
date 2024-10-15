import { UpdateOperatingHourController } from '../../application/controllers/operatingHours/updateOperatingHourController';

import { makeUpdateOperatingHourUseCase } from './makeUpdateOperatingHourUseCase';

export function makeUpdateOperatingHourController() {
  const updateOperatingHourUseCase = makeUpdateOperatingHourUseCase();

  return new UpdateOperatingHourController(updateOperatingHourUseCase);
}
