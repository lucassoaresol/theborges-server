import { GetBookingByIdController } from '../../application/controllers/booking/GetBookingByIdController.js';

import { makeGetBookingByIdUseCase } from './makeGetBookingByIdUseCase.js';

export function makeGetBookingByIdController() {
  const getBookingByIdUseCase = makeGetBookingByIdUseCase();

  return new GetBookingByIdController(getBookingByIdUseCase);
}
