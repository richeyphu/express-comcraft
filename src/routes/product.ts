import express, { Router } from 'express';
import { checkSchema } from 'express-validator';

import { productController } from '@controllers';
import { validateSchema } from '@middleware';

const productRouter: Router = express.Router();

/* GET products listing. */
productRouter.get('/', productController.index);
productRouter.get('/q/:id', productController.showById);
productRouter.get('/:cat', productController.showByCategory);

productRouter.post('/', validateSchema.productInsert, productController.insert);

export default productRouter;
