"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByLocationHandler = exports.getCivicUpdatesHandler = exports.deleteCivicUpdateHandler = exports.updateCivicUpdateHandler = exports.getCivicUpdateHandler = exports.createCivicUpdateHandler = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const civicUpdates_service_1 = require("../services/civicUpdates.service");
const logger_1 = require("../utils/logger");
const createCivicUpdateHandler = async (req, res, next) => {
    try {
        const updateData = req.body;
        const update = await (0, civicUpdates_service_1.createCivicUpdate)(updateData);
        (0, apiResponse_1.default)(res, {
            message: 'Civic update created successfully',
            data: update,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in createCivicUpdateHandler: ${error}`);
        next(error);
    }
};
exports.createCivicUpdateHandler = createCivicUpdateHandler;
const getCivicUpdateHandler = async (req, res, next) => {
    try {
        const updateId = req.params.id;
        const update = await (0, civicUpdates_service_1.getCivicUpdateById)(updateId);
        (0, apiResponse_1.default)(res, {
            message: 'Civic update retrieved successfully',
            data: update,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getCivicUpdateHandler: ${error}`);
        next(error);
    }
};
exports.getCivicUpdateHandler = getCivicUpdateHandler;
const updateCivicUpdateHandler = async (req, res, next) => {
    try {
        const updateId = req.params.id;
        const updateData = req.body;
        const update = await (0, civicUpdates_service_1.updateCivicUpdate)(updateId, updateData);
        (0, apiResponse_1.default)(res, {
            message: 'Civic update updated successfully',
            data: update,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in updateCivicUpdateHandler: ${error}`);
        next(error);
    }
};
exports.updateCivicUpdateHandler = updateCivicUpdateHandler;
const deleteCivicUpdateHandler = async (req, res, next) => {
    try {
        const updateId = req.params.id;
        await (0, civicUpdates_service_1.deleteCivicUpdate)(updateId);
        (0, apiResponse_1.default)(res, {
            message: 'Civic update deleted successfully',
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in deleteCivicUpdateHandler: ${error}`);
        next(error);
    }
};
exports.deleteCivicUpdateHandler = deleteCivicUpdateHandler;
const getCivicUpdatesHandler = async (req, res, next) => {
    try {
        const filter = req.query;
        const options = {
            limit: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy,
        };
        const { updates, count } = await (0, civicUpdates_service_1.getCivicUpdates)(filter, options);
        (0, apiResponse_1.default)(res, {
            message: 'Civic updates retrieved successfully',
            data: updates,
            meta: {
                page: options.page,
                limit: options.limit,
                total: count,
            },
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getCivicUpdatesHandler: ${error}`);
        next(error);
    }
};
exports.getCivicUpdatesHandler = getCivicUpdatesHandler;
const searchByLocationHandler = async (req, res, next) => {
    try {
        const location = req.query;
        const updates = await (0, civicUpdates_service_1.searchCivicUpdatesByLocation)({
            state: location.state,
            district: location.district,
            pincode: location.pincode,
            areaName: location.areaName,
        });
        (0, apiResponse_1.default)(res, {
            message: 'Civic updates retrieved successfully',
            data: updates,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in searchByLocationHandler: ${error}`);
        next(error);
    }
};
exports.searchByLocationHandler = searchByLocationHandler;
