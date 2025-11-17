import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller';
import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  loginUser
);

router.get('/me', auth, getMe);

export default router;