import express, { Router } from 'express';

import { productController } from '@controllers';

const productRouter: Router = express.Router();

/* GET products listing. */
productRouter.get('/', productController.index);

export default productRouter;
