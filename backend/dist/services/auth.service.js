"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const users_model_1 = __importDefault(require("../models/users.model"));
const apiError_1 = require("../utils/apiError");
const register = async (userData) => {
    if (await users_model_1.default.findOne({ email: userData.email })) {
        throw new apiError_1.ConflictError('Email already taken');
    }
    const user = await users_model_1.default.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user',
    });
    return user.toObject();
};
exports.register = register;
const login = async (email, password) => {
    const user = await users_model_1.default.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new apiError_1.UnauthorizedError('Incorrect email or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, env_1.default.jwt.secret, {
        expiresIn: env_1.default.jwt.expire,
        algorithm: 'HS256'
    });
    console.log('Login successful - Token:', token);
    console.log('User:', user);
    // Create response object without Mongoose methods
    const responseUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        points: user.points,
        badges: user.badges,
        level: user.level,
        verified: user.verified,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    return {
        user: responseUser,
        tokens: {
            access: {
                token,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        },
    };
};
exports.login = login;
const getCurrentUser = async (userId) => {
    const user = await users_model_1.default.findById(userId).select('-password').lean();
    if (!user)
        throw new apiError_1.UnauthorizedError('User not found');
    return user;
};
exports.getCurrentUser = getCurrentUser;
