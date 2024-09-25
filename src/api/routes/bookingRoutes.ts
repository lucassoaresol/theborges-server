import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeCreateBookingController } from '../factories/booking/makeCreateBookingController';
import { makeGetBookingByIdController } from '../factories/booking/makeGetBookingByIdController';
import { makeGetBookingByPublicIdController } from '../factories/booking/makeGetBookingByPublicIdController';
import { makeUpdateBookingController } from '../factories/booking/makeUpdateBookingController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post('', routeAdapter(makeCreateBookingController()));
router.get(
  '/by-id/:id',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetBookingByIdController()),
);
router.get(
  '/by-public-id/:id',
  routeAdapter(makeGetBookingByPublicIdController()),
);
router.patch('/:id', routeAdapter(makeUpdateBookingController()));

export default router;
