import { RefreshTokenController } from '../../application/controllers/auth/RefreshTokenController';

import { makeRefreshTokenUseCase } from './makeRefreshTokenUseCase';

export function makeRefreshTokenController() {
  const refreshTokenUseCase = makeRefreshTokenUseCase();

  return new RefreshTokenController(refreshTokenUseCase);
}
