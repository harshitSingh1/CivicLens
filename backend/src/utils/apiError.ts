import httpStatus from 'http-status-codes';

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(httpStatus.BAD_REQUEST, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(httpStatus.NOT_FOUND, message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(httpStatus.UNAUTHORIZED, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(httpStatus.FORBIDDEN, message);
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(httpStatus.CONFLICT, message);
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}

export {
  ApiError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
};