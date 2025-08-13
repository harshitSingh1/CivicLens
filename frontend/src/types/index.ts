// src/types/index.ts

export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: 'pothole' | 'garbage' | 'light' | 'water' | 'traffic' | 'other';
  status: 'reported' | 'in-progress' | 'resolved' | 'rejected';
  severity: 'low' | 'medium' | 'high' | 'urgent';
  location: {
    coordinates: [number, number];
    state: string;
    district: string;
    pincode: string;
    address?: string;
  };
  images: string[];
  reportedBy: {
    _id: string;
    name: string;
    profilePicture?: string;
    points: number;
  };
  upvotes: string[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface CreateIssueInput {
  title: string;
  description: string;
  category: string;
  severity: string;
  location: {
    coordinates: [number, number];
    state: string;
    district: string;
    pincode: string;
    address?: string;
  };
  email?: string;
}

export interface User {
  _id: string | undefined;
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  badges: string[];
  reportsCount: number;
  avatar: string;
}

export interface DashboardMetrics {
  totalIssues: number;
  resolvedIssues: number;
  avgResolutionTime: number;
  activeUsers: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface Comment {
  _id: string;
  userId: string | {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  text: string;
  createdAt: string;
}

export interface IssuesResponse {
  issues: Issue[];
  count: number;
}