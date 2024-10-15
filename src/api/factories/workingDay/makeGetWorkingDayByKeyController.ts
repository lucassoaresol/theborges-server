import { GetWorkingDayByKeyController } from '../../application/controllers/workingDay/GetWorkingDayByKeyController';

import { makeGetWorkingDayByKeyUseCase } from './makeGetWorkingDayByKeyUseCase';

export function makeGetWorkingDayByKeyController() {
  const getWorkingDayByKeyUseCase = makeGetWorkingDayByKeyUseCase();

  return new GetWorkingDayByKeyController(getWorkingDayByKeyUseCase);
}
