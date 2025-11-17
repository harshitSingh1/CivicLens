// src/controllers/dashboard.controller.ts
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/apiResponse';
import { getDashboardStats, getMapData } from '../services/dashboard.service';
import { logger } from '../utils/logger';

interface MapBounds {
  ne: [number, number];
  sw: [number, number];
}

const getDashboardStatsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getDashboardStats();

    sendResponse(res, {
      message: 'Dashboard stats retrieved successfully',
      data: stats,
    });
  } catch (error) {
    logger.error(`Error in getDashboardStatsHandler: ${error}`);
    next(error);
  }
};

const getMapDataHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Safely parse and validate the bounds parameter
    let bounds: MapBounds | undefined;
    
    if (req.query.bounds) {
      try {
        bounds = typeof req.query.bounds === 'string' 
          ? JSON.parse(req.query.bounds) 
          : undefined;
        
        // Validate the structure
        if (bounds && (
          !Array.isArray(bounds.ne) || 
          !Array.isArray(bounds.sw) ||
          bounds.ne.length !== 2 ||
          bounds.sw.length !== 2
        )) {
          bounds = undefined;
        }
      } catch (e) {
        bounds = undefined;
      }
    }

    const data = await getMapData(bounds);

    sendResponse(res, {
      message: 'Map data retrieved successfully',
      data,
    });
  } catch (error) {
    logger.error(`Error in getMapDataHandler: ${error}`);
    next(error);
  }
};

export { getDashboardStatsHandler, getMapDataHandler };