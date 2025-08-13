import { Document } from 'mongoose';

export type IssueCategory =
  | 'pothole'
  | 'garbage'
  | 'light'
  | 'water'
  | 'traffic'
  | 'other';

export type IssueStatus =
  | 'reported'
  | 'open'
  | 'in-progress'
  | 'resolved'
  | 'rejected';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'urgent';

export interface ILocation {
  coordinates: [number, number];
  state: string;
  district: string;
  pincode: string;
  address?: string;
}

export interface IComment {
  userId: string;
  text: string;
  createdAt?: Date;
}

export interface IAIAnalysis {
  categoryConfidence: number;
  severityScore: number;
  automatedTags: string[];
}

export interface IIssue extends Document {
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  severity: IssueSeverity;
  location: ILocation;
  images: string[];
  reportedBy: string;
  assignedTo?: string;
  comments: IComment[];
  upvotes: string[];
  aiAnalysis?: IAIAnalysis;
}

export interface ICreateIssueInput {
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  location: {
    coordinates: [number, number];
    state: string;
    district: string;
    pincode: string;
    address?: string;
  };
  images?: Express.Multer.File[];
}

export interface IUpdateIssueInput {
  status?: IssueStatus;
  assignedTo?: string;
  comment?: string;
}

export interface IIssueFilter {
  category?: IssueCategory;
  status?: IssueStatus;
  severity?: IssueSeverity;
  state?: string;
  district?: string;
  pincode?: string;
  userId?: string;
  search?: string;
}