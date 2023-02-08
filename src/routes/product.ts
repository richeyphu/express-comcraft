import express, { Router } from 'express';
import { body } from 'express-validator';

import { productController } from '@controllers';

const productRouter: Router = express.Router();

/* GET products listing. */
productRouter.get('/', productController.index);
productRouter.get('/q/:id', productController.showById);
productRouter.get('/:cat', productController.showByCategory);

productRouter.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('กรุณาป้อนชื่อสินค้า'),
    body('price')
      .not()
      .isEmpty()
      .withMessage('กรุณาป้อนราคา')
      .isNumeric()
      .withMessage('ราคาต้องเป็นตัวเลขเท่านั้น'),
  ],
  productController.insert
);

export default productRouter;
