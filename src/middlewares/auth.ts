import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAME, SECRET_KEY } from '../config';
import ApiError from '../errors/errors';

export default function auth(req: Request, _res: Response, next: NextFunction) {
  const authToken = req.cookies[AUTH_COOKIE_NAME];

  if (!authToken) {
    const error = new ApiError('Необходима авторизация', 'Unauthorized');
    return next(error);
  }

  try {
    const payload = jwt.verify(authToken, SECRET_KEY);

    if (typeof payload === 'string') {
      return next(new ApiError('Необходима авторизация', 'Unauthorized'));
    }

    req.user = payload;

    return next();
  } catch {
    return next(new ApiError('Необходима авторизация', 'Unauthorized'));
  }
}
