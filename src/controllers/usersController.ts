import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '@models/user';
import config from '@config';
import errorHandler from '@middleware/errorHandler';

const index = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    fullname: 'Phurit Dechaboonsiripanit',
  });
};

export { index };
