import { CreateProfessionalController } from '../../application/controllers/professional/CreateProfessionalController';

import { makeCreateProfessionalUseCase } from './makeCreateProfessionalUseCase';

export function makeCreateProfessionalController() {
  const createProfessionalUseCase = makeCreateProfessionalUseCase();

  return new CreateProfessionalController(createProfessionalUseCase);
}
