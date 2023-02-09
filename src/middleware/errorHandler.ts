import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

import { StatusCode } from '@config';

export interface IError extends Error {
  statusCode?: number;
  validation?: ValidationError[];
}

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    status_code: statusCode,
    message: err.message,
    validation: err.validation,
  });
};

export default errorHandler;
