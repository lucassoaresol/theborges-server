import { CreateHolidayExceptionController } from '../../application/controllers/holidayException/CreateHolidayExceptionController';

import { makeCreateHolidayExceptionUseCase } from './makeCreateHolidayExceptionUseCase';

export function makeCreateHolidayExceptionController() {
  const createHolidayExceptionUseCase = makeCreateHolidayExceptionUseCase();

  return new CreateHolidayExceptionController(createHolidayExceptionUseCase);
}
