import type { NextFunction, Request, Response } from 'express';

function serverError(
  error: unknown,
  _: Request,
  response: Response,
  next: NextFunction,
) {
  if (!error) {
    return next();
  }

  if (error instanceof Error) {
    response.status(500).json({
      message: error.message,
    });
  }
}

export default serverError;
