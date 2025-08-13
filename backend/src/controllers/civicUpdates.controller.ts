// backend\src\controllers\civicUpdates.controller.ts
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/apiResponse';
import {
  createCivicUpdate,
  getCivicUpdateById,
  updateCivicUpdate,
  deleteCivicUpdate,
  getCivicUpdates,
  searchCivicUpdatesByLocation,
} from '../services/civicUpdates.service';
import { logger } from '../utils/logger';

const createCivicUpdateHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData = req.body;
    const update = await createCivicUpdate(updateData);

    sendResponse(res, {
      message: 'Civic update created successfully',
      data: update,
    });
  } catch (error) {
    logger.error(`Error in createCivicUpdateHandler: ${error}`);
    next(error);
  }
};

const getCivicUpdateHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateId = req.params.id;
    const update = await getCivicUpdateById(updateId);

    sendResponse(res, {
      message: 'Civic update retrieved successfully',
      data: update,
    });
  } catch (error) {
    logger.error(`Error in getCivicUpdateHandler: ${error}`);
    next(error);
  }
};

const updateCivicUpdateHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateId = req.params.id;
    const updateData = req.body;
    const update = await updateCivicUpdate(updateId, updateData);

    sendResponse(res, {
      message: 'Civic update updated successfully',
      data: update,
    });
  } catch (error) {
    logger.error(`Error in updateCivicUpdateHandler: ${error}`);
    next(error);
  }
};

const deleteCivicUpdateHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateId = req.params.id;
    await deleteCivicUpdate(updateId);

    sendResponse(res, {
      message: 'Civic update deleted successfully',
    });
  } catch (error) {
    logger.error(`Error in deleteCivicUpdateHandler: ${error}`);
    next(error);
  }
};

const getCivicUpdatesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query;
    const options = {
      limit: parseInt(req.query.limit as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: req.query.sortBy as string,
    };

    const { updates, count } = await getCivicUpdates(filter, options);

    sendResponse(res, {
      message: 'Civic updates retrieved successfully',
      data: updates,
      meta: {
        page: options.page,
        limit: options.limit,
        total: count,
      },
    });
  } catch (error) {
    logger.error(`Error in getCivicUpdatesHandler: ${error}`);
    next(error);
  }
};

const searchByLocationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const location = req.query;
    const updates = await searchCivicUpdatesByLocation({
      state: location.state as string,
      district: location.district as string,
      pincode: location.pincode as string,
      areaName: location.areaName as string,
    });

    sendResponse(res, {
      message: 'Civic updates retrieved successfully',
      data: updates,
    });
  } catch (error) {
    logger.error(`Error in searchByLocationHandler: ${error}`);
    next(error);
  }
};

export {
  createCivicUpdateHandler,
  getCivicUpdateHandler,
  updateCivicUpdateHandler,
  deleteCivicUpdateHandler,
  getCivicUpdatesHandler,
  searchByLocationHandler,
};