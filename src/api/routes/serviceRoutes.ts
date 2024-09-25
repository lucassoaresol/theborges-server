import { Router } from 'express';

import { makeGetServiceController } from '../factories/service/makeGetServiceController';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.get('', routeAdapter(makeGetServiceController()));

export default router;
