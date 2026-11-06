const errorStatusCode = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const;

type ErrorName =
  | 'CastError'
  | 'ValidationError'
  | 'NotFound'
  | 'Unauthorized'
  | 'Conflict'
  | 'ServerError';

export default class ApiError extends Error {
  statusCode: number;

  constructor(
    message = 'На сервере произошла ошибка',
    errorName: ErrorName = 'ServerError',
  ) {
    super(message);

    this.name = errorName;
    this.statusCode = ApiError.getStatusCode(errorName);
  }

  static from(
    error: unknown,
    message = 'На сервере произошла ошибка',
  ): ApiError {
    // Уже подготовленную ошибку не преобразуем повторно.
    if (error instanceof ApiError) {
      return error;
    }

    // Превращаем ошибку Mongoose в понятный ответ
    const errorName = error instanceof Error ? error.name : '';

    if (errorName === 'CastError') {
      return new ApiError(message, 'CastError');
    }

    if (errorName === 'ValidationError') {
      const validationError = error as {
        errors?: Record<string, {
          message: string;
          kind: string;
        }>;
      };
      // Показываем сообщение только из кастомного validate в схеме
      const validationMessage = validationError.errors
        ? Object.values(validationError.errors)
          .filter((item) => item.kind === 'user defined')
          .map((item) => item.message)
          .join('; ')
        : message;

      return new ApiError(validationMessage || message, 'ValidationError');
    }

    // При неизвестных ошибках выдаем статус 500
    return new ApiError('На сервере произошла ошибка');
  }

  private static getStatusCode(errorName: ErrorName): number {
    if (errorName === 'NotFound') {
      return errorStatusCode.NOT_FOUND;
    }

    if (errorName === 'Unauthorized') {
      return errorStatusCode.UNAUTHORIZED;
    }

    if (errorName === 'Conflict') {
      return errorStatusCode.CONFLICT;
    }

    if (errorName === 'CastError' || errorName === 'ValidationError') {
      return errorStatusCode.BAD_REQUEST;
    }

    return errorStatusCode.SERVER_ERROR;
  }
}
