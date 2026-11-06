import { isCelebrateError } from 'celebrate';
import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import ApiError from '../errors/errors';

export default function errorHandler(
  err: ErrorRequestHandler,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (isCelebrateError(err)) {
    const [validationError] = err.details.values();

    const { message } = validationError.details[0];
    return res.status(400).send({ message });
  }
  const error = ApiError.from(err);
  return res.status(error.statusCode).send({ message: error.message });
}
