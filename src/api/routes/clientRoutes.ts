import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeCreateClientController } from '../factories/client/makeCreateClientController';
import { makeListClientController } from '../factories/client/makeListClientController';
import { makeRetrieveClientController } from '../factories/client/makeRetrieveClientController';
import { makeUpdateClientController } from '../factories/client/makeUpdateClientController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post('', routeAdapter(makeCreateClientController()));

router.get(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeListClientController()),
);

router.get('/:id', routeAdapter(makeRetrieveClientController()));

router.patch('/:id', routeAdapter(makeUpdateClientController()));

export default router;
