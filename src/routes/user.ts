import express, { Router } from 'express';
import { body } from 'express-validator';

import { userController } from '@controllers';

const router: Router = express.Router();

/* GET users listing. */
router.get('/', userController.index);

router.post(
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
router.post(
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

export default router;
