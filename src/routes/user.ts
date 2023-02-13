import express, { Router } from 'express';

import { userController } from '@controllers';
import { validateSchema } from '@middleware';

const userRouter: Router = express.Router();

/* GET users listing. */
userRouter.get('/', userController.index);

userRouter.post(
  '/register',
  validateSchema.userRegister,
  userController.register
);
userRouter.post('/login', validateSchema.userLogin, userController.login);

export default userRouter;
