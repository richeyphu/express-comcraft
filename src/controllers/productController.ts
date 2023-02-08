import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import config from '@config';
import { Product, IProduct } from '@models';
import { IError } from '@middleware';
import { isCorrectOid } from '@utils';

const index = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products: IProduct[] = await Product.find()
      .select('name price description category brand photo')
      .sort({ _id: -1 });
    res.status(200).json({
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

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: IError = new Error('ข้อมูลที่ได้รับมาไม่ถูกต้อง');
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const product = new Product({
      name,
      price,
      description,
      brand,
      category,
      photo,
    });
    await product.save();

    res.status(201).json({
      message: 'เพิ่มข้อมูลเรียบร้อยแล้ว',
    });
  } catch (error) {
    next(error);
  }
};

const showById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const oid = req.params.id;

    if (!isCorrectOid(oid)) {
      const error: IError = new Error('ไม่พบข้อมูล');
      error.statusCode = 404;
      throw error;
    }

    const product: IProduct | null = await Product.findById(oid);

    if (!product) {
      const error: IError = new Error('ไม่พบข้อมูล');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const showByCategory = async (
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
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export { index, insert, showById, showByCategory };
