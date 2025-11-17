// backend\src\routes\civicUpdates.routes.ts
import express from 'express';
import {
  createCivicUpdateHandler,
  getCivicUpdateHandler,
  updateCivicUpdateHandler,
  deleteCivicUpdateHandler,
  getCivicUpdatesHandler,
  searchByLocationHandler,
} from '../controllers/civicUpdates.controller';
import { auth, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  auth,
  authorize('admin', 'authority'),
  [
    body('type')
      .isIn(['event', 'hazard', 'project', 'alert', 'utility'])
      .withMessage('Invalid update type'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('affectedAreas').isArray({ min: 1 }).withMessage('At least one affected area is required'),
    body('affectedAreas.*.state').trim().notEmpty().withMessage('State is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('status')
      .isIn(['upcoming', 'ongoing', 'completed'])
      .withMessage('Invalid status'),
    body('source')
      .isIn(['government', 'community', 'automated'])
      .withMessage('Invalid source'),
  ],
  validate,
  createCivicUpdateHandler
);

router.get('/', getCivicUpdatesHandler);

router.get('/search', searchByLocationHandler);

router.get('/:id', getCivicUpdateHandler);

router.patch(
  '/:id',
  auth,
  authorize('admin', 'authority'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('status')
      .optional()
      .isIn(['upcoming', 'ongoing', 'completed'])
      .withMessage('Invalid status'),
    body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
    body('severity')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid severity'),
  ],
  validate,
  updateCivicUpdateHandler
);

router.delete('/:id', auth, authorize('admin', 'authority'), deleteCivicUpdateHandler);

export default router;