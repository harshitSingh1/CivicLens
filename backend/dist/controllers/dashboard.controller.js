"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMapDataHandler = exports.getDashboardStatsHandler = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const dashboard_service_1 = require("../services/dashboard.service");
const logger_1 = require("../utils/logger");
const getDashboardStatsHandler = async (_req, res, next) => {
    try {
        const stats = await (0, dashboard_service_1.getDashboardStats)();
        (0, apiResponse_1.default)(res, {
            message: 'Dashboard stats retrieved successfully',
            data: stats,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getDashboardStatsHandler: ${error}`);
        next(error);
    }
};
exports.getDashboardStatsHandler = getDashboardStatsHandler;
const getMapDataHandler = async (req, res, next) => {
    try {
        // Safely parse and validate the bounds parameter
        let bounds;
        if (req.query.bounds) {
            try {
                bounds = typeof req.query.bounds === 'string'
                    ? JSON.parse(req.query.bounds)
                    : undefined;
                // Validate the structure
                if (bounds && (!Array.isArray(bounds.ne) ||
                    !Array.isArray(bounds.sw) ||
                    bounds.ne.length !== 2 ||
                    bounds.sw.length !== 2)) {
                    bounds = undefined;
                }
            }
            catch (e) {
                bounds = undefined;
            }
        }
        const data = await (0, dashboard_service_1.getMapData)(bounds);
        (0, apiResponse_1.default)(res, {
            message: 'Map data retrieved successfully',
            data,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getMapDataHandler: ${error}`);
        next(error);
    }
};
exports.getMapDataHandler = getMapDataHandler;
