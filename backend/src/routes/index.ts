// backend\src\routes\index.ts
import express from 'express';
import authRoutes from './auth.routes';
import issuesRoutes from './issues.routes';
import civicUpdatesRoutes from './civicUpdates.routes';
import dashboardRoutes from './dashboard.routes';
import { errorHandler } from '../middlewares/error.middleware';
import usersRouter from './users.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/issues', issuesRoutes);
router.use('/civic-updates', civicUpdatesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', usersRouter);

// Error handling middleware
router.use(errorHandler);

export default router;