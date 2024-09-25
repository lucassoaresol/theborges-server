import { GetFreeTimeSlotsController } from '../../application/controllers/workingDay/GetFreeTimeSlotsController.js';

import { makeGetFreeTimeSlotsUseCase } from './makeGetFreeTimeSlotsUseCase.js';

export function makeGetFreeTimeSlotsController() {
  const getFreeTimeSlotsUseCase = makeGetFreeTimeSlotsUseCase();

  return new GetFreeTimeSlotsController(getFreeTimeSlotsUseCase);
}
