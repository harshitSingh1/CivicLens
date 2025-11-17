"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.addComment = exports.upvoteIssue = exports.getIssues = exports.deleteIssue = exports.updateIssue = exports.getIssueById = exports.createIssue = void 0;
const issues_model_1 = __importDefault(require("../models/issues.model"));
const users_model_1 = __importDefault(require("../models/users.model"));
const apiError_1 = require("../utils/apiError");
const upload_1 = require("../utils/upload");
const createIssue = async (userId, issueData, files) => {
    const images = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const imageUrl = await (0, upload_1.uploadToCloudinary)(file);
            images.push(imageUrl);
        }
    }
    const issue = await issues_model_1.default.create({
        title: issueData.title,
        description: issueData.description,
        category: issueData.category,
        severity: issueData.severity,
        location: issueData.location,
        images,
        reportedBy: userId,
    });
    // Add points to user for reporting
    await users_model_1.default.findByIdAndUpdate(userId, { $inc: { points: 10 } });
    return issue;
};
exports.createIssue = createIssue;
const getIssueById = async (issueId) => {
    const issue = await issues_model_1.default.findById(issueId)
        .populate('reportedBy', 'name profilePicture points')
        .populate('assignedTo', 'name profilePicture')
        .populate('comments.userId', 'name profilePicture');
    if (!issue) {
        throw new apiError_1.NotFoundError('Issue not found');
    }
    return issue;
};
exports.getIssueById = getIssueById;
const updateIssue = async (issueId, updateData, userId) => {
    const issue = await issues_model_1.default.findById(issueId);
    if (!issue) {
        throw new apiError_1.NotFoundError('Issue not found');
    }
    if (updateData.status) {
        issue.status = updateData.status;
    }
    if (updateData.assignedTo) {
        issue.assignedTo = updateData.assignedTo;
    }
    if (updateData.comment && userId) {
        issue.comments.push({
            userId,
            text: updateData.comment,
            createdAt: new Date()
        });
    }
    await issue.save();
    return issue;
};
exports.updateIssue = updateIssue;
const deleteIssue = async (issueId) => {
    const issue = await issues_model_1.default.findByIdAndDelete(issueId);
    if (!issue) {
        throw new apiError_1.NotFoundError('Issue not found');
    }
};
exports.deleteIssue = deleteIssue;
const getIssues = async (filter, options) => {
    const query = {};
    console.log('Building query with filter:', filter);
    if (filter.category) {
        query.category = filter.category;
    }
    if (filter.status) {
        query.status = filter.status;
    }
    if (filter.severity) {
        query.severity = filter.severity;
    }
    if (filter.state) {
        query['location.state'] = filter.state;
    }
    if (filter.district) {
        query['location.district'] = filter.district;
    }
    if (filter.pincode) {
        query['location.pincode'] = filter.pincode;
    }
    if (filter.userId) {
        query.reportedBy = filter.userId;
    }
    if (filter.search) {
        query.$text = { $search: filter.search };
    }
    if (Object.keys(query).length === 0) {
        query.$or = [
            { status: { $exists: true } },
            { _id: { $exists: true } }
        ];
    }
    const limit = options.limit || 10;
    const page = options.page || 1;
    const skip = (page - 1) * limit;
    const sort = {};
    if (options.sortBy) {
        const parts = options.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    else {
        sort.createdAt = -1;
    }
    console.log('Final query:', query);
    console.log('Sort options:', sort);
    const [issues, count] = await Promise.all([
        issues_model_1.default.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('reportedBy', 'name profilePicture points')
            .populate('comments.userId', 'name profilePicture')
            .lean(),
        issues_model_1.default.countDocuments(query)
    ]);
    console.log('Query results:', issues.length, 'issues found'); // Debug log
    return {
        issues: issues.map(issue => ({
            ...issue,
            // Ensure required fields exist
            location: issue.location || { coordinates: [0, 0], state: '', district: '', pincode: '' },
            images: issue.images || [],
            upvotes: issue.upvotes || []
        })),
        count
    };
};
exports.getIssues = getIssues;
const upvoteIssue = async (issueId, userId) => {
    const issue = await issues_model_1.default.findById(issueId);
    if (!issue)
        throw new apiError_1.NotFoundError('Issue not found');
    const upvoteIndex = issue.upvotes.indexOf(userId);
    if (upvoteIndex >= 0) {
        // Remove upvote if already exists
        issue.upvotes.splice(upvoteIndex, 1);
    }
    else {
        // Add upvote if doesn't exist
        issue.upvotes.push(userId);
    }
    await issue.save();
    return issue;
};
exports.upvoteIssue = upvoteIssue;
const addComment = async (issueId, comment) => {
    const issue = await issues_model_1.default.findByIdAndUpdate(issueId, { $push: { comments: comment } }, { new: true })
        .populate('reportedBy', 'name profilePicture points')
        .populate('comments.userId', 'name profilePicture'); // Ensure population
    if (!issue)
        throw new apiError_1.NotFoundError('Issue not found');
    return issue;
};
exports.addComment = addComment;
const deleteComment = async (issueId, commentId, userId) => {
    const issue = await issues_model_1.default.findOneAndUpdate({
        _id: issueId,
        'comments._id': commentId,
        'comments.userId': userId
    }, { $pull: { comments: { _id: commentId, userId } } }, { new: true }).populate('comments.userId', 'name profilePicture');
    if (!issue)
        throw new apiError_1.NotFoundError('Comment not found or not authorized');
    return issue;
};
exports.deleteComment = deleteComment;
