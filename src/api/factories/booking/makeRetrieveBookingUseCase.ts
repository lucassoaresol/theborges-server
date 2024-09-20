import { RetrieveBookingUseCase } from '../../application/useCases/booking/RetrieveBookingUseCase';

export function makeRetrieveBookingUseCase() {
  return new RetrieveBookingUseCase();
}
