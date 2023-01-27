import { Request, Response, NextFunction } from 'express';
import { ResultFactory, ValidationError } from 'express-validator';

interface IError extends Error {
  statusCode?: number;
  validation?: ResultFactory<ValidationError>;
}

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status_code: statusCode,
    message: err.message,
    validation: err.validation,
  });
};

export default errorHandler;
