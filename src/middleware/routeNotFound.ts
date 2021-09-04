import type { Request, Response } from 'express';

function routeNotFound(_: Request, response: Response) {
  response.status(404).json({
    message: 'API endpoint does not exist',
  });
}

export default routeNotFound;
