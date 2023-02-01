import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import config from '@config';
import { User } from '@models';
import { errorHandler } from '@middleware';

const index = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    fullname: 'Phurit Dechaboonsiripanit',
  });
};

export { index };
