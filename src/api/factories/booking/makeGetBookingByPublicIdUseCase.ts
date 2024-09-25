import { GetBookingByPublicIdUseCase } from '../../application/useCases/booking/GetBookingByPublicIdUseCase';

export function makeGetBookingByPublicIdUseCase() {
  return new GetBookingByPublicIdUseCase();
}
