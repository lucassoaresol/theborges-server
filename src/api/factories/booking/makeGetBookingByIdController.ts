import { GetBookingByIdController } from '../../application/controllers/booking/GetBookingByIdController';

import { makeGetBookingByIdUseCase } from './makeGetBookingByIdUseCase';

export function makeGetBookingByIdController() {
  const getBookingByIdUseCase = makeGetBookingByIdUseCase();

  return new GetBookingByIdController(getBookingByIdUseCase);
}
