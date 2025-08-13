// backend\src\models\civicUpdates.model.ts
import mongoose from 'mongoose';
import { ICivicUpdate } from '../interfaces/civicUpdates.interface';

const civicUpdateSchema = new mongoose.Schema<ICivicUpdate>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Create text index for search
civicUpdateSchema.index({
  title: 'text',
  description: 'text',
  'affectedAreas.state': 'text',
  'affectedAreas.district': 'text',
  'affectedAreas.pincode': 'text',
  'affectedAreas.areaName': 'text',
});

const CivicUpdate = mongoose.model<ICivicUpdate>('CivicUpdate', civicUpdateSchema);

export default CivicUpdate;