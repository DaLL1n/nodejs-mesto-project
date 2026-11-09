import expressWinston from 'express-winston';
import winston from 'winston';

const requestLogger = expressWinston.logger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/request.log',
      format: winston.format.json(),
    }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  level: 'error',
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
  ],
  format: winston.format.json(),
});

export { errorLogger, requestLogger };
