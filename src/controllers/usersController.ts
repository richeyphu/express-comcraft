import { Request, Response, NextFunction } from 'express';
import User from '@models/user';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import config from '@config';

const index = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    fullname: 'Phurit Dechaboonsiripanit',
  });
};

export { index };
