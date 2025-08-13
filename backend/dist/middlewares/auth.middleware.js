"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const users_model_1 = __importDefault(require("../models/users.model"));
const apiError_1 = require("../utils/apiError");
// src/middlewares/auth.middleware.ts
const auth = async (req, _res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new apiError_1.UnauthorizedError('Authentication required');
        }
        const token = authHeader.replace('Bearer ', '').trim();
        // 2. Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwt.secret);
        }
        catch (err) {
            throw new apiError_1.UnauthorizedError('Invalid or expired token');
        }
        // 3. Find user
        const user = await users_model_1.default.findById(decoded.id).select('-password');
        if (!user) {
            throw new apiError_1.UnauthorizedError('User not found');
        }
        // 4. Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.auth = auth;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new apiError_1.ForbiddenError('You are not authorized to access this resource');
        }
        next();
    };
};
exports.authorize = authorize;
