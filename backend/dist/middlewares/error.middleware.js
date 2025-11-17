"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const apiError_1 = require("../utils/apiError");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
        logger_1.logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    logger_1.logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger_1.logger.error(err.stack);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
