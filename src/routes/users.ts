import express, { Router } from 'express';

import * as usersController from '@controllers/usersController';

const router: Router = express.Router();

/* GET users listing. */
router.get('/', usersController.index);

export default router;
