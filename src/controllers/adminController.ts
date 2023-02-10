import { Request, Response, NextFunction } from 'express';

import { StatusCode } from '@config';

const index = (req: Request, res: Response, next: NextFunction): void => {
  res.status(StatusCode.I_AM_A_TEAPOT).json({ message: "I'm a teapot!" });
};

export { index };
