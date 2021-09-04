import type { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * @apiDefine ProductValidationError
 *
 * @apiError (Unprocessable Entity 422) {String}   message         Error message
 * @apiError (Unprocessable Entity 422) {Object}   errors          Error details
 * @apiError (Unprocessable Entity 422) {String[]} errors.title    Title's errors
 * @apiError (Unprocessable Entity 422) {String[]} errors.price    Price's errors
 * @apiError (Unprocessable Entity 422) {String[]} errors.category Category's errors
 *
 * @apiErrorExample Validation-Response:
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *      "errors": {
 *        "category": ["Path `category` is required."],
 *        "price": ["Path `price` is required."],
 *        "title": ["Path `title` is required."]
 *      },
 *      "message": "Validation errors"
 *    }
 */

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
