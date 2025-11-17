// src/routes/users.routes.ts
import express from 'express';
import { auth } from '../middlewares/auth.middleware';
import { updateUser, updatePassword } from '../controllers/users.controller';
import { validate } from '../middlewares/validate.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.patch(
  '/me',
  auth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  validate,
  updateUser
);

router.patch(
  '/me/password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validate,
  updatePassword
);

export default router;