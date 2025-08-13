"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateUser = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const users_service_1 = require("../services/users.service");
const logger_1 = require("../utils/logger");
const updateUser = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const updateData = req.body;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const updatedUser = await (0, users_service_1.updateUserProfile)(userId, updateData);
        (0, apiResponse_1.default)(res, {
            message: 'User updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in updateUser: ${error}`);
        next(error);
    }
};
exports.updateUser = updateUser;
const updatePassword = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { currentPassword, newPassword } = req.body;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        await (0, users_service_1.changeUserPassword)(userId, currentPassword, newPassword);
        (0, apiResponse_1.default)(res, {
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in updatePassword: ${error}`);
        next(error);
    }
};
exports.updatePassword = updatePassword;
