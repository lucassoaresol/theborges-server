import { DeleteOperatingHourController } from '../../application/controllers/operatingHours/deleteOperatingHourController';

import { makeDeleteOperatingHourUseCase } from './makeDeleteOperatingHourUseCase';

export function makeDeleteOperatingHourControllerController() {
  const deleteOperatingHourUseCase = makeDeleteOperatingHourUseCase();

  return new DeleteOperatingHourController(deleteOperatingHourUseCase);
}
