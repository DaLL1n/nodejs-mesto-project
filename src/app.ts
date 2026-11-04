import express from 'express';
import mongoose from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import router from './routes';
import type { AuthenticatedRequest } from './types/request';
import ApiError from './errors/errors';

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as AuthenticatedRequest).user = {
    _id: '6ae9eebdebc67517bc66643e',
  };

  next();
});

app.use('/', router);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new ApiError('Маршрут не найден', 'NotFound');

  return next(error);
});

app.use(
  (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode).send({ message: err.message });
  },
);

app.listen(3000);
