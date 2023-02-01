import express, { Router } from 'express';

import { productController } from '@controllers';

const router: Router = express.Router();

/* GET users listing. */
router.get('/', productController.index);

export default router;
