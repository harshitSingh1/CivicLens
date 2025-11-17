"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// backend\src\models\issues.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const issueSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['pothole', 'light', 'garbage', 'water', 'traffic', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['reported', 'open', 'in-progress', 'resolved', 'rejected'],
        default: 'reported'
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    location: {
        coordinates: {
            type: [Number],
            required: true
        },
        state: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        address: String
    },
    images: {
        type: [String],
        default: []
    },
    reportedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    upvotes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    aiAnalysis: {
        categoryConfidence: Number,
        severityScore: Number,
        automatedTags: [String]
    }
}, {
    timestamps: true
});
issueSchema.index({ 'location.coordinates': '2dsphere' });
issueSchema.index({
    title: 'text',
    description: 'text',
    'location.state': 'text',
    'location.district': 'text',
    'location.pincode': 'text'
});
const Issue = mongoose_1.default.model('Issue', issueSchema);
exports.default = Issue;
