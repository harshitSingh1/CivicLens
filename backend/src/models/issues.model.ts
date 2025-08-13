// backend\src\models\issues.model.ts
import mongoose, { Schema } from 'mongoose';
import { IIssue } from '../interfaces/issues.interface';

const issueSchema = new Schema<IIssue>({
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
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'User'
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId as any,
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
      type: mongoose.Schema.Types.ObjectId as any,
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

const Issue = mongoose.model<IIssue>('Issue', issueSchema);
export default Issue;