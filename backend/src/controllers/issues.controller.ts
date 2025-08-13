// backend\src\controllers\issues.controller.ts
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/apiResponse';
import {
  createIssue,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssues,
  upvoteIssue,
  addComment,
  deleteComment
} from '../services/issues.service';
import { upload } from '../utils/upload';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';

const createIssueHandler = [
  upload.array('images', 5),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const issueData = req.body;
      const files = req.files as Express.Multer.File[];

      console.log('Received issue data:', issueData);
      console.log('Received files:', files?.length);

      // Parse location if it's a string
      if (typeof issueData.location === 'string') {
        try {
          issueData.location = JSON.parse(issueData.location);
        } catch (err) {
          console.error('Error parsing location:', err);
          throw new ApiError(400, 'Invalid location format');
        }
      }

      // Validate coordinates exist
      if (!issueData.location?.coordinates) {
        console.warn('No coordinates provided, using [0,0]');
        issueData.location.coordinates = [0, 0];
      }

      const issue = await createIssue(userId, issueData, files);

      console.log('Created issue in DB:', issue);

      sendResponse(res, {
        message: 'Issue reported successfully',
        data: issue,
      });
    } catch (error) {
      console.error('Error in createIssueHandler:', error);
      next(error);
    }
  },
];

const getIssueHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueId = req.params.id;
    const issue = await getIssueById(issueId);

    sendResponse(res, {
      message: 'Issue retrieved successfully',
      data: issue,
    });
  } catch (error) {
    logger.error(`Error in getIssueHandler: ${error}`);
    next(error);
  }
};

const updateIssueHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueId = req.params.id;
    const updateData = req.body;
    const userId = req.user.id;

    const issue = await updateIssue(issueId, updateData, userId);

    sendResponse(res, {
      message: 'Issue updated successfully',
      data: issue,
    });
  } catch (error) {
    logger.error(`Error in updateIssueHandler: ${error}`);
    next(error);
  }
};

const deleteIssueHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueId = req.params.id;
    await deleteIssue(issueId);

    sendResponse(res, {
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    logger.error(`Error in deleteIssueHandler: ${error}`);
    next(error);
  }
};

// backend/src/controllers/issues.controller.ts
const getIssuesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query;
    const options = {
      limit: parseInt(req.query.limit as string) || 100, // Increased default limit
      page: parseInt(req.query.page as string) || 1,
      sortBy: req.query.sortBy as string || '-createdAt', // Default sort by newest
    };

    console.log('Query filters:', filter); // Debug log
    const { issues, count } = await getIssues(filter, options);
    
    console.log('Found issues:', issues.length); // Debug log
    
    sendResponse(res, {
      message: 'Issues retrieved successfully',
      data: { 
        issues: issues || [], // Ensure array is returned
        count: count || 0 
      },
    });
  } catch (error) {
    console.error('Error in getIssuesHandler:', error);
    next(error);
  }
};

const upvoteIssueHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    const issue = await upvoteIssue(issueId, userId);
    sendResponse(res, {
      message: 'Issue upvoted successfully',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

const addCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
      throw new ApiError(400, 'Comment text is required');
    }

    const comment = {
      userId,
      text,
      createdAt: new Date()
    };

    const issue = await addComment(issueId, comment);
    sendResponse(res, {
      message: 'Comment added successfully',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: issueId, commentId } = req.params;
    const userId = req.user.id;

    const issue = await deleteComment(issueId, commentId, userId);
    sendResponse(res, {
      message: 'Comment deleted successfully',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createIssueHandler,
  getIssueHandler,
  updateIssueHandler,
  deleteIssueHandler,
  getIssuesHandler,
  upvoteIssueHandler,
  addCommentHandler,
  deleteCommentHandler
};