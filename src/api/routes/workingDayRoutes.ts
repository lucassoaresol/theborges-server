import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeOptionalAuthenticationMiddleware } from '../factories/auth/makeOptionalAuthenticationMiddleware';
import { makeGetFreeTimeSlotsController } from '../factories/workingDay/makeGetFreeTimeSlotsController';
import { makeGetWorkingDayByKeyController } from '../factories/workingDay/makeGetWorkingDayByKeyController';
import { makeGetWorkingDayController } from '../factories/workingDay/makeGetWorkingDayController';
import { makeUpdateWorkingDayController } from '../factories/workingDay/makeUpdateWorkingDayController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post(
  '/free-time',
  middlewareAdapter(makeOptionalAuthenticationMiddleware()),
  routeAdapter(makeGetFreeTimeSlotsController()),
);

router.get(
  '',
  middlewareAdapter(makeOptionalAuthenticationMiddleware()),
  routeAdapter(makeGetWorkingDayController()),
);

router.get(
  '/:id',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetWorkingDayByKeyController()),
);

router.patch(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateWorkingDayController()),
);

export default router;
