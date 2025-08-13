// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    logger.error(
      `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  logger.error(
    `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  logger.error(err.stack);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export {errorHandler};