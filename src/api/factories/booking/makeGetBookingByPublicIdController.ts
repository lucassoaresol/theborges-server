import { GetBookingByPublicIdController } from '../../application/controllers/booking/GetBookingByPublicIdController';

import { makeGetBookingByPublicIdUseCase } from './makeGetBookingByPublicIdUseCase';

export function makeGetBookingByPublicIdController() {
  const getBookingByPublicIdUseCase = makeGetBookingByPublicIdUseCase();

  return new GetBookingByPublicIdController(getBookingByPublicIdUseCase);
}
