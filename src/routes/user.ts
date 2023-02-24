import express, { Router } from 'express';

import { userController } from '@controllers';
import { validateSchema, isLogin } from '@middleware';

const userRouter: Router = express.Router();

/* GET user listing. */
userRouter.get('/', isLogin, userController.index);
userRouter.get('/address', isLogin, userController.address);
userRouter.get('/wishlist', isLogin, userController.wishlist);

userRouter.post(
  '/register',
  validateSchema.userRegister,
  userController.register
);
userRouter.post('/login', validateSchema.userLogin, userController.login);
userRouter.post(
  '/address',
  isLogin,
  validateSchema.userAddress,
  userController.insertAddress
);

userRouter.put('/address/:id', isLogin, userController.updateAddress);

userRouter.delete('/address/:id', isLogin, userController.destroyAddress);

export default userRouter;
