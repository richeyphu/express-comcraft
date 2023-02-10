import { Request, Response, NextFunction } from 'express';

import { StatusCode } from '@config';

const index = (req: Request, res: Response, next: NextFunction): void => {
  res.status(StatusCode.OK).json({ message: 'Welcome to ComShop!' });
};

export { index };
