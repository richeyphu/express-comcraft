import { Request, Response, NextFunction } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { env } from '@config';
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
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const existEmail: IUser | null = await User.findOne({ email: email });
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

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as IUser;

    // validation
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    // check email isExist
    const user: IUser | null = await User.findOne({ email: email });
    if (!user) {
      const error: IError = new Error('ไม่พบผู้ใช้งาน');
      error.statusCode = 404;
      throw error;
    }

    const isValid = user.checkPassword(password);
    if (!isValid) {
      const error: IError = new Error('รหัสผ่านไม่ถูกต้อง');
      error.statusCode = 401;
      throw error;
    }

    // token
    const token: string = jwt.sign(
      {
        id: user._id as string,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: '5 days',
      }
    );

    const expires_in = jwt.decode(token) as JwtPayload;

    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: 'Bearer',
    });
  } catch (error) {
    next(error);
  }
};

export { index, register, login };
