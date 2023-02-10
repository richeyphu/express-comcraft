import express, { Router } from 'express';

import { adminController } from '@controllers';

const router: Router = express.Router();

/* GET home page. */
router.all('/', adminController.index);

export default router;
