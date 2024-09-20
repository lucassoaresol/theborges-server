import { ListOperatingHourController } from '../../application/controllers/operatingHours/listOperatingHourController.js';

import { makeListOperatingHourUseCase } from './makeListOperatingHourUseCase.js';

export function makeListOperatingHourController() {
  const listOperatingHourUseCase = makeListOperatingHourUseCase();

  return new ListOperatingHourController(listOperatingHourUseCase);
}
