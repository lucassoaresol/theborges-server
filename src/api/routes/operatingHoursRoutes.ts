import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeCreateOperatingHourController } from '../factories/operatingHours/makeCreateOperatingHourController';
import { makeDeleteOperatingHourControllerController } from '../factories/operatingHours/makeDeleteOperatingHourController';
import { makeListOperatingHourController } from '../factories/operatingHours/makeListOperatingHourController';
import { makeUpdateOperatingHourController } from '../factories/operatingHours/makeUpdateOperatingHourController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeCreateOperatingHourController()),
);

router.get('', routeAdapter(makeListOperatingHourController()));

router.patch(
  '/:id',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateOperatingHourController()),
);

router.delete(
  '/:id',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeDeleteOperatingHourControllerController()),
);

export default router;
