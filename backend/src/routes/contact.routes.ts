// backend/src/routes/contact.routes.ts
import express from 'express';
import {
  createContactHandler,
  getContactsHandler,
  getContactHandler,
  updateContactHandler,
  deleteContactHandler
} from '../controllers/contact.controller';
import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.post('/', 
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  validate,
  createContactHandler
);

router.get('/', auth, getContactsHandler);
router.get('/:id', auth, getContactHandler);
router.patch('/:id', auth, updateContactHandler);
router.delete('/:id', auth, deleteContactHandler);

export default router;