import { RetrieveBookingController } from '../../application/controllers/booking/RetrieveBookingController.js';

import { makeRetrieveBookingUseCase } from './makeRetrieveBookingUseCase.js';

export function makeRetrieveBookingController() {
  const retrieveBookingUseCase = makeRetrieveBookingUseCase();

  return new RetrieveBookingController(retrieveBookingUseCase);
}
