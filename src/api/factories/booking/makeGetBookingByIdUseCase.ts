import { GetBookingByIdUseCase } from '../../application/useCases/booking/GetBookingByIdUseCase';

export function makeGetBookingByIdUseCase() {
  return new GetBookingByIdUseCase();
}
