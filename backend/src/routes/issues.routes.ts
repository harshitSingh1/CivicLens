// backend\src\routes\issues.routes.ts
import express from 'express';
import {
  createIssueHandler,
  getIssueHandler,
  updateIssueHandler,
  deleteIssueHandler,
  getIssuesHandler,
  upvoteIssueHandler,
  addCommentHandler,
  deleteCommentHandler
} from '../controllers/issues.controller';
import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.post('/', auth, createIssueHandler);

router.get('/', getIssuesHandler);

router.get('/:id', getIssueHandler);

router.patch(
  '/:id',
  auth,
  [
    body('status')
      .optional()
      .isIn(['reported', 'open','in-progress', 'resolved', 'rejected'])
      .withMessage('Invalid status'),
    body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
    body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
  ],
  validate,
  updateIssueHandler
);

router.delete('/:id', auth, deleteIssueHandler);
router.post('/:id/upvote', auth, upvoteIssueHandler);
router.post('/:id/comments', auth, addCommentHandler);
router.delete('/:id/comments/:commentId', auth, deleteCommentHandler);

export default router;