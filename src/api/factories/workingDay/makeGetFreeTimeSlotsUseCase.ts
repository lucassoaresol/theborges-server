import { GetFreeTimeSlotsUseCase } from '../../application/useCases/workingDay/GetFreeTimeSlotsUseCase';

export function makeGetFreeTimeSlotsUseCase() {
  return new GetFreeTimeSlotsUseCase();
}
