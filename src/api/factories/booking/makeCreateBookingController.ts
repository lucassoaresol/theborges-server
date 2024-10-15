import { CreateBookingController } from '../../application/controllers/booking/CreateBookingController';

import { makeCreateBookingUseCase } from './makeCreateBookingUseCase';

export function makeCreateBookingController() {
  const createBookingUseCase = makeCreateBookingUseCase();

  return new CreateBookingController(createBookingUseCase);
}
