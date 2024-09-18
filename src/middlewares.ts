/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import {ErrorResponse} from './types/MessageTypes';
import CustomError from './classes/CustomError';
import {FieldValidationError, validationResult} from 'express-validator';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  // console.error('errorHandler', chalk.red(err.stack));
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const validate = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${(error as FieldValidationError).path}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

export {notFound, errorHandler, validate};
