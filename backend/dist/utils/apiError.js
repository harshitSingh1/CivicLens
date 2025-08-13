"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.ApiError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(http_status_codes_1.default.BAD_REQUEST, message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(http_status_codes_1.default.NOT_FOUND, message);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(http_status_codes_1.default.UNAUTHORIZED, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(http_status_codes_1.default.FORBIDDEN, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(http_status_codes_1.default.CONFLICT, message);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends ApiError {
    constructor(message = 'Internal Server Error') {
        super(http_status_codes_1.default.INTERNAL_SERVER_ERROR, message);
    }
}
exports.InternalServerError = InternalServerError;
