"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const auth_service_1 = require("../services/auth.service");
const logger_1 = require("../utils/logger");
const apiError_1 = require("../utils/apiError");
const registerUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await (0, auth_service_1.register)(userData);
        (0, apiResponse_1.default)(res, {
            message: 'User registered successfully',
            data: user,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in registerUser: ${error}`);
        next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const loginResponse = await (0, auth_service_1.login)(email, password);
        (0, apiResponse_1.default)(res, {
            message: 'Login successful',
            data: {
                token: loginResponse.tokens.access.token,
                user: loginResponse.user
            },
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in loginUser: ${error}`);
        next(error);
    }
};
exports.loginUser = loginUser;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new apiError_1.UnauthorizedError('User not authenticated');
        }
        const user = await (0, auth_service_1.getCurrentUser)(req.user.id);
        if (!user) {
            throw new apiError_1.UnauthorizedError('User not found');
        }
        (0, apiResponse_1.default)(res, {
            message: 'User retrieved successfully',
            data: user,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getMe: ${error}`);
        next(error);
    }
};
exports.getMe = getMe;
