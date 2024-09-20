import { PublicIdGenerator } from '../../../services/PublicIdGenerator';
import { CreateClientUseCase } from '../../application/useCases/client/CreateClientUseCase';

export function makeCreateClientUseCase() {
  const publicIdGenerator = new PublicIdGenerator();

  return new CreateClientUseCase(publicIdGenerator);
}
