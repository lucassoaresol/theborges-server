import { GetWorkingDayController } from '../../application/controllers/workingDay/GetWorkingDayController';

import { makeGetWorkingDayUseCase } from './makeGetWorkingDayUseCase';

export function makeGetWorkingDayController() {
  const getWorkingDayUseCase = makeGetWorkingDayUseCase();

  return new GetWorkingDayController(getWorkingDayUseCase);
}
