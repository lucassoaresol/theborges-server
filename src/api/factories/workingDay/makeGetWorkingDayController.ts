import { GetWorkingDayController } from '../../application/controllers/workingDay/GetWorkingDayController.js';

import { makeGetWorkingDayUseCase } from './makeGetWorkingDayUseCase.js';

export function makeGetWorkingDayController() {
  const getWorkingDayUseCase = makeGetWorkingDayUseCase();

  return new GetWorkingDayController(getWorkingDayUseCase);
}
