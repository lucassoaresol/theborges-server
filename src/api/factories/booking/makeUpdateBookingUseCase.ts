import { env } from '../../application/config/env';
import { UpdateBookingUseCase } from '../../application/useCases/booking/UpdateBookingUseCase';

export function makeUpdateBookingUseCase() {
  const TEMPLATE_NAME = 'CANCELL_BOOKING';
  return new UpdateBookingUseCase(env.clientId, TEMPLATE_NAME);
}
