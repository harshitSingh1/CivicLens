// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import User from '../models/users.model';
import { UnauthorizedError, ForbiddenError } from '../utils/apiError';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

// src/middlewares/auth.middleware.ts
const auth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // 1. Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }
    const token = authHeader.replace('Bearer ', '').trim();

    // 2. Verify token
    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // 3. Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError('You are not authorized to access this resource');
    }
    next();
  };
};

export { auth, authorize };