import express, { Router } from 'express';

import { productController } from '@controllers';

const router: Router = express.Router();

/* GET products listing. */
router.get('/', productController.index);

export default router;
