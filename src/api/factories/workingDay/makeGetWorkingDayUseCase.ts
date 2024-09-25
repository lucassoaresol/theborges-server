import { GetWorkingDayUseCase } from '../../application/useCases/workingDay/GetWorkingDayUseCase';

export function makeGetWorkingDayUseCase() {
  return new GetWorkingDayUseCase();
}
