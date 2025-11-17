"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCivicUpdatesByLocation = exports.getCivicUpdates = exports.deleteCivicUpdate = exports.updateCivicUpdate = exports.getCivicUpdateById = exports.createCivicUpdate = void 0;
const civicUpdates_model_1 = __importDefault(require("../models/civicUpdates.model"));
const apiError_1 = require("../utils/apiError");
const createCivicUpdate = async (civicUpdateData) => {
    return civicUpdates_model_1.default.create(civicUpdateData);
};
exports.createCivicUpdate = createCivicUpdate;
const getCivicUpdateById = async (updateId) => {
    const update = await civicUpdates_model_1.default.findById(updateId);
    if (!update) {
        throw new apiError_1.NotFoundError('Civic update not found');
    }
    return update;
};
exports.getCivicUpdateById = getCivicUpdateById;
const updateCivicUpdate = async (updateId, updateData) => {
    const update = await civicUpdates_model_1.default.findByIdAndUpdate(updateId, updateData, {
        new: true,
        runValidators: true,
    });
    if (!update) {
        throw new apiError_1.NotFoundError('Civic update not found');
    }
    return update;
};
exports.updateCivicUpdate = updateCivicUpdate;
const deleteCivicUpdate = async (updateId) => {
    const update = await civicUpdates_model_1.default.findByIdAndDelete(updateId);
    if (!update) {
        throw new apiError_1.NotFoundError('Civic update not found');
    }
};
exports.deleteCivicUpdate = deleteCivicUpdate;
const getCivicUpdates = async (filter, options) => {
    const query = {};
    if (filter.type) {
        query.type = filter.type;
    }
    if (filter.status) {
        query.status = filter.status;
    }
    if (filter.severity) {
        query.severity = filter.severity;
    }
    if (filter.source) {
        query.source = filter.source;
    }
    if (filter.state) {
        query['affectedAreas.state'] = filter.state;
    }
    if (filter.district) {
        query['affectedAreas.district'] = filter.district;
    }
    if (filter.pincode) {
        query['affectedAreas.pincode'] = filter.pincode;
    }
    if (filter.areaName) {
        query['affectedAreas.areaName'] = filter.areaName;
    }
    if (filter.search) {
        query.$text = { $search: filter.search };
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
        sort.startDate = -1;
    }
    const updates = await civicUpdates_model_1.default.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const count = await civicUpdates_model_1.default.countDocuments(query);
    return { updates, count };
};
exports.getCivicUpdates = getCivicUpdates;
const searchCivicUpdatesByLocation = async (location) => {
    const query = {
        'affectedAreas.state': location.state,
    };
    if (location.district) {
        query['affectedAreas.district'] = location.district;
    }
    if (location.pincode) {
        query['affectedAreas.pincode'] = location.pincode;
    }
    if (location.areaName) {
        query['affectedAreas.areaName'] = location.areaName;
    }
    return civicUpdates_model_1.default.find(query).sort({ startDate: -1 });
};
exports.searchCivicUpdatesByLocation = searchCivicUpdatesByLocation;
