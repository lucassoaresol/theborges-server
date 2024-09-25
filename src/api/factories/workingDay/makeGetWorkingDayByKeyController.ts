import { GetWorkingDayByKeyController } from '../../application/controllers/workingDay/GetWorkingDayByKeyController.js';

import { makeGetWorkingDayByKeyUseCase } from './makeGetWorkingDayByKeyUseCase.js';

export function makeGetWorkingDayByKeyController() {
  const getWorkingDayByKeyUseCase = makeGetWorkingDayByKeyUseCase();

  return new GetWorkingDayByKeyController(getWorkingDayByKeyUseCase);
}
