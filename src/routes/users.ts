import express, { Router } from 'express';

import { usersController } from '@controllers';

const router: Router = express.Router();

/* GET users listing. */
router.get('/', usersController.index);

export default router;
