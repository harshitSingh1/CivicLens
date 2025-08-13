"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend\src\models\civicUpdates.model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const civicUpdateSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ['event', 'hazard', 'project', 'alert', 'utility'],
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    affectedAreas: [
        {
            state: {
                type: String,
                required: true,
            },
            district: String,
            pincode: String,
            areaName: String,
        },
    ],
    startDate: {
        type: Date,
        required: true,
    },
    endDate: Date,
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
    },
    source: {
        type: String,
        enum: ['government', 'community', 'automated'],
        required: true,
    },
    contactInfo: String,
    relatedLinks: [String],
}, {
    timestamps: true,
});
// Create text index for search
civicUpdateSchema.index({
    title: 'text',
    description: 'text',
    'affectedAreas.state': 'text',
    'affectedAreas.district': 'text',
    'affectedAreas.pincode': 'text',
    'affectedAreas.areaName': 'text',
});
const CivicUpdate = mongoose_1.default.model('CivicUpdate', civicUpdateSchema);
exports.default = CivicUpdate;
