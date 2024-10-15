import { GetFreeTimeSlotsController } from '../../application/controllers/workingDay/GetFreeTimeSlotsController';

import { makeGetFreeTimeSlotsUseCase } from './makeGetFreeTimeSlotsUseCase';

export function makeGetFreeTimeSlotsController() {
  const getFreeTimeSlotsUseCase = makeGetFreeTimeSlotsUseCase();

  return new GetFreeTimeSlotsController(getFreeTimeSlotsUseCase);
}
