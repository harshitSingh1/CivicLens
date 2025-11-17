// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../utils/apiError';

const validate = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((err) => err.msg).join(', ')
    );
  }
  next();
};

export {validate};