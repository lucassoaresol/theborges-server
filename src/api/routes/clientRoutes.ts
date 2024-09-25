import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeCreateClientController } from '../factories/client/makeCreateClientController';
import { makeGetClientByIdController } from '../factories/client/makeGetClientByIdController';
import { makeGetClientByPhoneController } from '../factories/client/makeGetClientByPhoneController';
import { makeGetClientByPublicIdController } from '../factories/client/makeGetClientByPublicIdController';
import { makeGetClientController } from '../factories/client/makeGetClientController';
import { makeUpdateClientController } from '../factories/client/makeUpdateClientController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post('', routeAdapter(makeCreateClientController()));

router.get(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetClientController()),
);

router.get(
  '/by-id/:id',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetClientByIdController()),
);

router.get('/by-phone/:id', routeAdapter(makeGetClientByPhoneController()));

router.get(
  '/by-public-id/:id',
  routeAdapter(makeGetClientByPublicIdController()),
);

router.patch('/:id', routeAdapter(makeUpdateClientController()));

export default router;
