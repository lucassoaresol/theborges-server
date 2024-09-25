import { GetBookingByPublicIdController } from '../../application/controllers/booking/GetBookingByPublicIdController.js';

import { makeGetBookingByPublicIdUseCase } from './makeGetBookingByPublicIdUseCase.js';

export function makeGetBookingByPublicIdController() {
  const getBookingByPublicIdUseCase = makeGetBookingByPublicIdUseCase();

  return new GetBookingByPublicIdController(getBookingByPublicIdUseCase);
}
