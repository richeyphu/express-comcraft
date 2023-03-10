import express, { Router } from 'express';

import { productController } from '@controllers';
import { validateSchema, isLogin, isAdmin } from '@middleware';

const productRouter: Router = express.Router();

/* GET products listing. */
productRouter.get('/', productController.index);
productRouter.get('/:cat', productController.getByCategory);
productRouter.get('/i/:id', productController.getById);
productRouter.get('/q/:q', productController.search);

productRouter.post(
  '/',
  isLogin,
  isAdmin,
  validateSchema.productInsert,
  productController.insert
);
productRouter.post('/i/:id/wish', isLogin, productController.addToWishlist);

productRouter.put(
  '/i/:id',
  isLogin,
  isAdmin,
  validateSchema.productUpdate,
  productController.update
);

productRouter.delete('/i/:id', productController.destroy);
productRouter.delete(
  '/i/:id/unwish',
  isLogin,
  productController.removeFromWishlist
);

export default productRouter;
