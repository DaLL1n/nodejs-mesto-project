import { isCelebrateError } from 'celebrate';
import type {
  ErrorRequestHandler,
} from 'express';
import ApiError from '../errors/errors';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (isCelebrateError(err)) {
    const [validationError] = err.details.values();

    const { message } = validationError.details[0];
    return res.status(400).send({ message });
  }
  const error = ApiError.from(err);
  return res.status(error.statusCode).send({ message: error.message });
};

export default errorHandler;
