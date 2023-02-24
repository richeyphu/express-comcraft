import express, { Router } from 'express';

import { productController } from '@controllers';
import { validateSchema, isLogin, isAdmin } from '@middleware';

const productRouter: Router = express.Router();

/* GET products listing. */
productRouter.get('/', productController.index);
productRouter.get('/q/:id', productController.getById);
productRouter.get('/:cat', productController.getByCategory);

productRouter.post(
  '/',
  isLogin,
  isAdmin,
  validateSchema.productInsert,
  productController.insert
);

productRouter.put(
  '/q/:id',
  isLogin,
  isAdmin,
  validateSchema.productUpdate,
  productController.update
);

productRouter.delete('/q/:id', productController.destroy);

export default productRouter;
