import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../errors/errors';

export default function auth(req: Request, _res: Response, next: NextFunction) {
  const authToken = req.cookies['auth-token'];

  if (!authToken) {
    const error = new ApiError('Необходима авторизация', 'Unauthorized');
    return next(error);
  }

  try {
    const payload = jwt.verify(authToken, 'auth-token');

    if (typeof payload === 'string') {
      return next(new ApiError('Необходима авторизация', 'Unauthorized'));
    }

    req.user = payload;

    return next();
  } catch {
    return next(new ApiError('Необходима авторизация', 'Unauthorized'));
  }
}
