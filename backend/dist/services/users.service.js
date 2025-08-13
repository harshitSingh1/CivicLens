"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPassword = exports.updateUserProfile = void 0;
// src/services/users.service.ts
const users_model_1 = __importDefault(require("../models/users.model"));
const apiError_1 = require("../utils/apiError");
const updateUserProfile = async (userId, updateData) => {
    const user = await users_model_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select('-password');
    if (!user) {
        throw new apiError_1.NotFoundError('User not found');
    }
    return user;
};
exports.updateUserProfile = updateUserProfile;
const changeUserPassword = async (userId, currentPassword, newPassword) => {
    const user = await users_model_1.default.findById(userId).select('+password');
    if (!user) {
        throw new apiError_1.NotFoundError('User not found');
    }
    console.log('Comparing passwords...');
    console.log('Provided current password:', currentPassword);
    console.log('Stored password hash:', user.password);
    const isMatch = await user.comparePassword(currentPassword);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
        throw new apiError_1.UnauthorizedError('Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    console.log('Password updated successfully');
};
exports.changeUserPassword = changeUserPassword;
