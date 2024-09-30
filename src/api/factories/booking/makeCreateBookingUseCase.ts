import { PublicIdGenerator } from '../../../services/PublicIdGenerator';
import { env } from '../../application/config/env';
import { CreateBookingUseCase } from '../../application/useCases/booking/CreateBookingUseCase';

export function makeCreateBookingUseCase() {
  const publicIdGenerator = new PublicIdGenerator();

  const TEMPLATE_NAME = {
    new: 'NEW_BOOKING',
    new_person: 'NEW_BOOKING_PERSON',
  };
  return new CreateBookingUseCase(
    publicIdGenerator,
    env.clientId,
    TEMPLATE_NAME,
  );
}
