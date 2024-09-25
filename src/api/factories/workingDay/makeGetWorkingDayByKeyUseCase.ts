import { GetWorkingDayByKeyUseCase } from '../../application/useCases/workingDay/GetWorkingDayByKeyUseCase';

export function makeGetWorkingDayByKeyUseCase() {
  return new GetWorkingDayByKeyUseCase();
}
