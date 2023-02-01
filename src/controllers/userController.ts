import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import config from '@config';
import { User, IUser } from '@models';
import { IError } from '@middleware';

const index = (req: Request, res: Response, next: NextFunction): void => {
  res.status(200).json({
    fullname: 'Phurit Dechaboonsiripanit',
  });
};

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body as IUser;

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      const error: IError = new Error('อีเมลนี้มีผู้ใช้งานในระบบแล้ว');
      error.statusCode = 400;
      throw error;
    }

    const user: IUser = new User();
    user.name = name;
    user.email = email;
    user.password = user.encryptPassword(password);

    await user.save();

    res.status(201).json({
      message: 'เพิ่มข้อมูลเรียบร้อยแล้ว',
    });
  } catch (error) {
    next(error);
  }
};

export { index, register };
