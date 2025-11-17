"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentHandler = exports.addCommentHandler = exports.upvoteIssueHandler = exports.getIssuesHandler = exports.deleteIssueHandler = exports.updateIssueHandler = exports.getIssueHandler = exports.createIssueHandler = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const issues_service_1 = require("../services/issues.service");
const upload_1 = require("../utils/upload");
const logger_1 = require("../utils/logger");
const apiError_1 = require("../utils/apiError");
const createIssueHandler = [
    upload_1.upload.array('images', 5),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const issueData = req.body;
            const files = req.files;
            console.log('Received issue data:', issueData);
            console.log('Received files:', files?.length);
            // Parse location if it's a string
            if (typeof issueData.location === 'string') {
                try {
                    issueData.location = JSON.parse(issueData.location);
                }
                catch (err) {
                    console.error('Error parsing location:', err);
                    throw new apiError_1.ApiError(400, 'Invalid location format');
                }
            }
            // Validate coordinates exist
            if (!issueData.location?.coordinates) {
                console.warn('No coordinates provided, using [0,0]');
                issueData.location.coordinates = [0, 0];
            }
            const issue = await (0, issues_service_1.createIssue)(userId, issueData, files);
            console.log('Created issue in DB:', issue);
            (0, apiResponse_1.default)(res, {
                message: 'Issue reported successfully',
                data: issue,
            });
        }
        catch (error) {
            console.error('Error in createIssueHandler:', error);
            next(error);
        }
    },
];
exports.createIssueHandler = createIssueHandler;
const getIssueHandler = async (req, res, next) => {
    try {
        const issueId = req.params.id;
        const issue = await (0, issues_service_1.getIssueById)(issueId);
        (0, apiResponse_1.default)(res, {
            message: 'Issue retrieved successfully',
            data: issue,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getIssueHandler: ${error}`);
        next(error);
    }
};
exports.getIssueHandler = getIssueHandler;
const updateIssueHandler = async (req, res, next) => {
    try {
        const issueId = req.params.id;
        const updateData = req.body;
        const userId = req.user.id;
        const issue = await (0, issues_service_1.updateIssue)(issueId, updateData, userId);
        (0, apiResponse_1.default)(res, {
            message: 'Issue updated successfully',
            data: issue,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in updateIssueHandler: ${error}`);
        next(error);
    }
};
exports.updateIssueHandler = updateIssueHandler;
const deleteIssueHandler = async (req, res, next) => {
    try {
        const issueId = req.params.id;
        await (0, issues_service_1.deleteIssue)(issueId);
        (0, apiResponse_1.default)(res, {
            message: 'Issue deleted successfully',
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in deleteIssueHandler: ${error}`);
        next(error);
    }
};
exports.deleteIssueHandler = deleteIssueHandler;
// backend/src/controllers/issues.controller.ts
const getIssuesHandler = async (req, res, next) => {
    try {
        const filter = req.query;
        const options = {
            limit: parseInt(req.query.limit) || 100, // Increased default limit
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || '-createdAt', // Default sort by newest
        };
        console.log('Query filters:', filter); // Debug log
        const { issues, count } = await (0, issues_service_1.getIssues)(filter, options);
        console.log('Found issues:', issues.length); // Debug log
        (0, apiResponse_1.default)(res, {
            message: 'Issues retrieved successfully',
            data: {
                issues: issues || [], // Ensure array is returned
                count: count || 0
            },
        });
    }
    catch (error) {
        console.error('Error in getIssuesHandler:', error);
        next(error);
    }
};
exports.getIssuesHandler = getIssuesHandler;
const upvoteIssueHandler = async (req, res, next) => {
    try {
        const issueId = req.params.id;
        const userId = req.user.id;
        const issue = await (0, issues_service_1.upvoteIssue)(issueId, userId);
        (0, apiResponse_1.default)(res, {
            message: 'Issue upvoted successfully',
            data: issue,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.upvoteIssueHandler = upvoteIssueHandler;
const addCommentHandler = async (req, res, next) => {
    try {
        const issueId = req.params.id;
        const userId = req.user.id;
        const { text } = req.body;
        if (!text) {
            throw new apiError_1.ApiError(400, 'Comment text is required');
        }
        const comment = {
            userId,
            text,
            createdAt: new Date()
        };
        const issue = await (0, issues_service_1.addComment)(issueId, comment);
        (0, apiResponse_1.default)(res, {
            message: 'Comment added successfully',
            data: issue,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addCommentHandler = addCommentHandler;
const deleteCommentHandler = async (req, res, next) => {
    try {
        const { id: issueId, commentId } = req.params;
        const userId = req.user.id;
        const issue = await (0, issues_service_1.deleteComment)(issueId, commentId, userId);
        (0, apiResponse_1.default)(res, {
            message: 'Comment deleted successfully',
            data: issue,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCommentHandler = deleteCommentHandler;
