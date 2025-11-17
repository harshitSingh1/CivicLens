// src/controllers/users.controller.ts
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/apiResponse';
import { updateUserProfile, changeUserPassword } from '../services/users.service';
import { logger } from '../utils/logger';

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const updateData = req.body;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const updatedUser = await updateUserProfile(userId, updateData);
    
    sendResponse(res, {
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    logger.error(`Error in updateUser: ${error}`);
    next(error);
  }
};

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    await changeUserPassword(userId, currentPassword, newPassword);
    
    sendResponse(res, {
      message: 'Password updated successfully'
    });
  } catch (error) {
    logger.error(`Error in updatePassword: ${error}`);
    next(error);
  }
};

export { updateUser, updatePassword };