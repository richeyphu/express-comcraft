import express, { Router } from 'express';

import { userController } from '@controllers';

const router: Router = express.Router();

/* GET users listing. */
router.get('/', userController.index);

export default router;
