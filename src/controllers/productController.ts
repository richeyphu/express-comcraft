import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { env, StatusCode } from '@config';
import {
  Product,
  IProduct,
  User,
  IUser,
  productCategory,
  ProductCategory,
} from '@models';
import { IError } from '@middleware';
import { isOid, saveImageToDisk } from '@utils';

const index = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products: IProduct[] = await Product.find()
      .select('name price description category brand photo')
      .sort({ _id: -1 });
    res.status(StatusCode.OK).json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const insert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, price, description, brand, category, photo } =
      req.body as IProduct;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      error.validation = errors.array();
      throw error;
    }

    const product = new Product({
      ...(name && { name }),
      ...(price && { price }),
      ...(description && { description }),
      ...(category && { category }),
      ...(brand && { brand }),
      ...(photo && { photo: saveImageToDisk(photo) }),
    });
    await product.save();

    res.status(StatusCode.CREATED).json({
      message: 'เพิ่มข้อมูลเรียบร้อยแล้ว',
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const oid = req.params.id;

    if (!isOid(oid)) {
      const error: IError = new Error('ไม่พบข้อมูล');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    }

    const product: IProduct | null = await Product.findById(oid);

    if (!product) {
      const error: IError = new Error('ไม่พบข้อมูล');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    }

    res.status(StatusCode.OK).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const getByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cat = req.params.cat as ProductCategory;

    if (![...productCategory].includes(cat)) {
      const error: IError = new Error('ไม่พบข้อมูล');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    }

    const product: IProduct[] = await Product.find({
      category: { $regex: new RegExp(cat, 'i') },
    });

    // if (product.length === 0) {
    //   const error: IError = new Error('ไม่พบข้อมูล');
    //   error.statusCode = StatusCode.NOT_FOUND;
    //   throw error;
    // }

    res.status(StatusCode.OK).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, description, category, brand, photo } =
      req.body as IProduct;

    if (!isOid(id)) {
      const error: IError = new Error('ID ไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      throw error;
    }

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      error.validation = errors.array();
      throw error;
    }

    const product = await Product.updateOne(
      { _id: id },
      {
        ...(name && { name }),
        ...(price && { price }),
        ...(description && { description }),
        ...(category && { category }),
        ...(brand && { brand }),
        ...(photo && { photo: saveImageToDisk(photo) }),
      }
    );

    if (product.modifiedCount === 0) {
      const error: IError = new Error('ไม่สามารถแก้ไขข้อมูลได้ / ไม่พบสินค้า');
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

const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isOid(id)) {
      const error: IError = new Error('ID ไม่ถูกต้อง');
      error.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
      throw error;
    }

    const product = await Product.deleteOne({
      _id: id,
    });

    if (product.deletedCount === 0) {
      const error: IError = new Error('ไม่สามารถลบข้อมูลได้ / ไม่พบสินค้า');
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: 'ลบข้อมูลเรียบร้อยแล้ว',
      });
    }
  } catch (error) {
    next(error);
  }
};

const search = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.params;

    const products: IProduct[] = await Product.find({
      $or: [
        { name: { $regex: new RegExp(q, 'i') } },
        { description: { $regex: new RegExp(q, 'i') } },
        { brand: { $regex: new RegExp(q, 'i') } },
        { category: { $regex: new RegExp(q, 'i') } },
      ],
    }).sort({ createdAt: -1 });

    res.status(StatusCode.OK).json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: prodId } = req.params;
    const { _id: userId } = req.user as IUser;

    const product = await Product.findById(prodId);

    if (!product) {
      const error: IError = new Error('ไม่พบสินค้า');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    }

    const user = await User.updateOne(
      { _id: userId },
      {
        $addToSet: {
          wishlist: prodId,
        },
      }
    );

    if (user.modifiedCount === 0) {
      const error: IError = new Error('ไม่สามารถแก้ไขข้อมูลได้ / ติดตามแล้ว');
      error.statusCode = StatusCode.BAD_REQUEST;
      throw error;
    } else {
      res.status(200).json({
        message: `ติดตาม ${prodId} สำเร็จ`,
      });
    }
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: prodId } = req.params;
    const { _id: userId } = req.user as IUser;

    const product = await Product.findById(prodId);

    if (!product) {
      const error: IError = new Error('ไม่พบสินค้า');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.updateOne(
      { _id: userId },
      {
        $pull: {
          wishlist: prodId,
        },
      }
    );

    if (user.modifiedCount === 0) {
      const error: IError = new Error('ไม่สามารถแก้ไขข้อมูลได้ / ไม่ได้ติดตาม');
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: `เลิกติดตาม ${prodId} สำเร็จ`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  index,
  insert,
  getById,
  getByCategory,
  update,
  destroy,
  search,
  addToWishlist,
  removeFromWishlist,
};
