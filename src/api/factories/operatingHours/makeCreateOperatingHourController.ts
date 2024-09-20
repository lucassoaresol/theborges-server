import { CreateOperatingHourController } from '../../application/controllers/operatingHours/createOperatingHourController.js';

import { makeCreateOperatingHourUseCase } from './makeCreateOperatingHourUseCase.js';

export function makeCreateOperatingHourController() {
  const createOperatingHourUseCase = makeCreateOperatingHourUseCase();

  return new CreateOperatingHourController(createOperatingHourUseCase);
}
