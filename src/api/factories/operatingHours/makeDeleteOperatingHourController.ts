import { DeleteOperatingHourController } from '../../application/controllers/operatingHours/deleteOperatingHourController.js';

import { makeDeleteOperatingHourUseCase } from './makeDeleteOperatingHourUseCase.js';

export function makeDeleteOperatingHourControllerController() {
  const deleteOperatingHourUseCase = makeDeleteOperatingHourUseCase();

  return new DeleteOperatingHourController(deleteOperatingHourUseCase);
}
