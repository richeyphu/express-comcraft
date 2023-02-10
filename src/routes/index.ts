import express, { Router } from 'express';

import { indexController } from '@controllers';

const router: Router = express.Router();

/* GET home page. */
router.get('/', indexController.index);

export default router;
