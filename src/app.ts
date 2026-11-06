import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import { userControllers } from './controllers';
import ApiError from './errors/errors';
import {
  auth,
  errorHandler,
  logger,
  validation,
} from './middlewares';
import router from './routes';
import type { } from './types/express';

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(logger.requestLogger);

app.use(express.json());
app.use(cookieParser());

app.post('/signin', validation.validateLogin, userControllers.login);
app.post('/signup', validation.validateCreateUser, userControllers.createUser);

app.use('/', auth, router);

app.use(logger.errorLogger);

app.use(
  (_req: Request, _res: Response, next: NextFunction) => {
    const error = new ApiError('Маршрут не найден', 'NotFound');

    return next(error);
  },
);

app.use(errorHandler);

app.listen(3000);
