import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import ApiError from './errors/errors';
import {
  errorHandler,
  logger,
} from './middlewares';
import router from './routes';
import type { } from './types/express';

const app = express();

app.use(logger.requestLogger);

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

app.use(
  (_req: Request, _res: Response, next: NextFunction) => {
    const error = new ApiError('Маршрут не найден', 'NotFound');

    return next(error);
  },
);

app.use(logger.errorLogger);
app.use(errorHandler);

async function startServer() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    app.listen(3000);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Не удалось подключиться к базе данных: ${message}\n`);
    process.exitCode = 1;
  }
}

startServer();
