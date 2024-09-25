import { Router } from 'express';

import { makeGetCategoryController } from '../factories/category/makeGetCategoryController';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.get('', routeAdapter(makeGetCategoryController()));

export default router;
