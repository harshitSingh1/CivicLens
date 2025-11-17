// backend\src\routes\dashboard.routes.ts
import express from 'express';
import { getDashboardStatsHandler, getMapDataHandler } from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/stats', getDashboardStatsHandler);

router.get('/map-data', getMapDataHandler);

export default router;