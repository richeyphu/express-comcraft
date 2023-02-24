import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { env, StatusCode } from '@config';
import { Product, IProduct } from '@models';
import { IError } from '@middleware';
import { isCorrectOid, saveImageToDisk } from '@utils';

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

    if (!isCorrectOid(oid)) {
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
    const product: IProduct[] = await Product.find({
      category: { $regex: new RegExp(req.params.cat, 'i') },
    });

    if (product.length === 0) {
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

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, description, category, brand, photo } =
      req.body as IProduct;

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

    if (product.nModified === 0) {
      const error: IError = new Error('ไม่สามารถแก้ไขข้อมูลได้ / ไม่พบสินค้า');
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
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

    const product = await Product.deleteOne({
      _id: id,
    });

    if (product.deletedCount === 0) {
      const error: IError = new Error('ไม่สามารถลบข้อมูลได้ / ไม่พบบริษัท');
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

export { index, insert, getById, getByCategory, update, destroy };
