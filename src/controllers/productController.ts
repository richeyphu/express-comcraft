import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import config from '@config';
import { Product, IProduct } from '@models';
import { errorHandler } from '@middleware';

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

export { index };
