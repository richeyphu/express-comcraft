import express, { Router } from 'express';
import { body } from 'express-validator';

import { userController } from '@controllers';

const userRouter: Router = express.Router();

/* GET users listing. */
userRouter.get('/', userController.index);

userRouter.post(
  '/register',
  [
    body('name').not().isEmpty().withMessage('กรุณาป้อนชื่อ-สกุลด้วย'),
    body('email')
      .not()
      .isEmpty()
      .withMessage('กรุณาป้อนอีเมลด้วย')
      .isEmail()
      .withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('กรุณาป้อนรหัสผ่านด้วย')
      .isLength({ min: 5 })
      .withMessage('รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร'),
  ],
  userController.register
);
userRouter.post(
  '/login',
  [
    body('email')
      .not()
      .isEmpty()
      .withMessage('กรุณาป้อนอีเมลด้วย')
      .isEmail()
      .withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('กรุณาป้อนรหัสผ่านด้วย')
      .isLength({ min: 5 })
      .withMessage('รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร'),
  ],
  userController.login
);

export default userRouter;
