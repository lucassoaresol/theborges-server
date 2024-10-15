import { CreateOperatingHourController } from '../../application/controllers/operatingHours/createOperatingHourController';

import { makeCreateOperatingHourUseCase } from './makeCreateOperatingHourUseCase';

export function makeCreateOperatingHourController() {
  const createOperatingHourUseCase = makeCreateOperatingHourUseCase();

  return new CreateOperatingHourController(createOperatingHourUseCase);
}
