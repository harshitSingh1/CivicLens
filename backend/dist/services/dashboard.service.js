"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMapData = exports.getDashboardStats = void 0;
// backend\src\services\dashboard.service.ts
const issues_model_1 = __importDefault(require("../models/issues.model"));
const users_model_1 = __importDefault(require("../models/users.model"));
const civicUpdates_model_1 = __importDefault(require("../models/civicUpdates.model"));
const getDashboardStats = async () => {
    const totalIssues = await issues_model_1.default.countDocuments();
    const resolvedIssues = await issues_model_1.default.countDocuments({ status: 'resolved' });
    const unresolvedIssues = totalIssues - resolvedIssues;
    const topContributors = await users_model_1.default.find()
        .sort({ points: -1 })
        .limit(5)
        .select('name profilePicture points badges');
    const recentUpdates = await civicUpdates_model_1.default.find()
        .sort({ createdAt: -1 })
        .limit(5);
    const issuesByCategory = await issues_model_1.default.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const issuesByStatus = await issues_model_1.default.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return {
        totalIssues,
        resolvedIssues,
        unresolvedIssues,
        resolutionRate: totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0,
        topContributors,
        recentUpdates,
        issuesByCategory,
        issuesByStatus,
    };
};
exports.getDashboardStats = getDashboardStats;
const getMapData = async (bounds) => {
    let query = {};
    if (bounds) {
        query = {
            'location.coordinates': {
                $geoWithin: {
                    $box: [bounds.sw, bounds.ne],
                },
            },
        };
    }
    return issues_model_1.default.find(query).select('title category status severity location.coordinates');
};
exports.getMapData = getMapData;
