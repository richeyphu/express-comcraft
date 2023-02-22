import express, { Router } from 'express';

import { userController } from '@controllers';
import { validateSchema, isLogin } from '@middleware';

const userRouter: Router = express.Router();

/* GET users listing. */
userRouter.get('/', isLogin, userController.index);

userRouter.post(
  '/register',
  validateSchema.userRegister,
  userController.register
);
userRouter.post('/login', validateSchema.userLogin, userController.login);

export default userRouter;
