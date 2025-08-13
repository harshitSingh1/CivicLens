// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/apiResponse';
import { register, login, getCurrentUser } from '../services/auth.service';
import { IRegisterInput } from '../interfaces/auth.interface';
import { logger } from '../utils/logger';
import { UnauthorizedError } from '../utils/apiError';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: IRegisterInput = req.body;
    const user = await register(userData);

    sendResponse(res, {
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Error in registerUser: ${error}`);
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const loginResponse = await login(email, password);

    sendResponse(res, {
      message: 'Login successful',
      data: {
        token: loginResponse.tokens.access.token,
        user: loginResponse.user
      },
    });
  } catch (error) {
    logger.error(`Error in loginUser: ${error}`);
    next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }
    
    const user = await getCurrentUser(req.user.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    sendResponse(res, {
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Error in getMe: ${error}`);
    next(error);
  }
};

export { registerUser, loginUser, getMe };