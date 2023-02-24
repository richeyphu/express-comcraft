import { Request, Response, NextFunction } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { env, StatusCode } from '@config';
import { User, IUser, Address, IAddress, IProduct } from '@models';
import { IError } from '@middleware';
import { isOid } from '@utils';

const index = (req: Request, res: Response, next: NextFunction): void => {
  const { role, name, email } = req.user as IUser;
  res.status(200).json({
    user: { name, email, role },
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
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      error.validation = errors.array();
      throw error;
    }

    const existEmail: IUser | null = await User.findOne({ email: email });
    if (existEmail) {
      const error: IError = new Error('อีเมลนี้มีผู้ใช้งานในระบบแล้ว');
      error.statusCode = StatusCode.CONFLICT;
      throw error;
    }

    const user: IUser = new User();
    user.name = name;
    user.email = email;
    user.password = user.encryptPassword(password);

    await user.save();

    res.status(StatusCode.CREATED).json({
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
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      error.validation = errors.array();
      throw error;
    }

    // check email isExist
    const user: IUser | null = await User.findOne({ email: email });
    if (!user) {
      const error: IError = new Error('ไม่พบผู้ใช้งาน');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    }

    const isValid = user.checkPassword(password);
    if (!isValid) {
      const error: IError = new Error('รหัสผ่านไม่ถูกต้อง');
      error.statusCode = StatusCode.UNAUTHORIZED;
      throw error;
    }

    // token
    const token: string = jwt.sign(
      {
        id: user._id,
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

const address = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id: userId, role } = req.user as IUser;

    const address: IAddress[] =
      role === 'admin'
        ? await Address.find().populate('user')
        : await Address.find({ user: userId });

    res.status(StatusCode.OK).json({
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

const insertAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, tel, address: addr } = req.body as IAddress;
    const { _id: userId } = req.user as IUser;

    // Validation
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      error.validation = errors.array();
      throw error;
    }

    const address = new Address({
      name,
      tel,
      address: addr,
      user: userId,
    });
    await address.save();

    res.status(StatusCode.CREATED).json({
      message: 'เพิ่มข้อมูลเรียบร้อยแล้ว',
    });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, tel, address: addr } = req.body as IAddress;
    const { _id: userId, role } = req.user as IUser;

    if (!isOid(id)) {
      const error: IError = new Error('ID ไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      throw error;
    }

    // Validation
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      error.validation = errors.array();
      throw error;
    }

    const address = await Address.updateOne(
      {
        _id: id,
        ...(role !== 'admin' && { user: userId }),
      },
      {
        ...(name && { name }),
        ...(tel && { tel }),
        ...(addr && { address: addr }),
      }
    );

    if (address.modifiedCount === 0) {
      const error: IError = new Error('ไม่สามารถแก้ไขข้อมูลได้ / ไม่พบที่อยู่');
      error.statusCode = StatusCode.BAD_REQUEST;
      throw error;
    } else {
      res.status(StatusCode.OK).json({
        message: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
      });
    }
  } catch (error) {
    next(error);
  }
};

const destroyAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { _id: userId, role } = req.user as IUser;

    if (!isOid(id)) {
      const error: IError = new Error('ID ไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      throw error;
    }

    const address = await Address.deleteOne({
      _id: id,
      ...(role !== 'admin' && { user: userId }),
    });

    if (address.deletedCount === 0) {
      const error: IError = new Error('ไม่สามารถลบข้อมูลได้ / ไม่พบที่อยู่');
      error.statusCode = 400;
      throw error;
    } else {
      res.status(StatusCode.OK).json({
        message: 'ลบข้อมูลเรียบร้อยแล้ว',
      });
    }
  } catch (error) {
    next(error);
  }
};

const wishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id: userId } = req.user as IUser;

    const user = await User.findOne({ _id: userId })
      .select('wishlist -_id')
      .populate('wishlist')
      .sort('wishlist');

    let wishlist = user?.wishlist as IProduct[] | undefined;
    wishlist = wishlist?.map((product) => {
      product.photo = `${env.DOMAIN}/images/${product.photo}`;
      return product;
    });
    res.status(StatusCode.OK).json({
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export {
  index,
  register,
  login,
  address,
  insertAddress,
  updateAddress,
  destroyAddress,
  wishlist,
};
