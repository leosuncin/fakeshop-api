import type { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

function transformValidationError(
  error: MongooseError.ValidationError,
): ValidationError {
  const errors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(error.errors)) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      errors[key].push(value.message);
    } else {
      errors[key] = [value.message];
    }
  }

  return {
    message: 'Validation errors',
    errors,
  };
}

function validationError(
  error: unknown,
  _: Request,
  response: Response<ValidationError>,
  next: NextFunction,
) {
  if (error instanceof MongooseError.ValidationError) {
    response.status(422).json(transformValidationError(error));
  } else {
    next(error);
  }
}

export default validationError;
