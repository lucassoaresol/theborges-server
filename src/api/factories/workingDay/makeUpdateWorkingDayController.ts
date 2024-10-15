import { UpdateWorkingDayController } from '../../application/controllers/workingDay/UpdateWorkingDayController';

import { makeUpdateWorkingDayUseCase } from './makeUpdateWorkingDayUseCase';

export function makeUpdateWorkingDayController() {
  const updateWorkingDayUseCase = makeUpdateWorkingDayUseCase();

  return new UpdateWorkingDayController(updateWorkingDayUseCase);
}
