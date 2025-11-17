// backend\src\interfaces\civicUpdates.interface.ts
import { Document } from 'mongoose';

export type CivicUpdateType =
  | 'event'
  | 'hazard'
  | 'project'
  | 'alert'
  | 'utility';

export type CivicUpdateStatus = 'upcoming' | 'ongoing' | 'completed';

export type CivicUpdateSeverity = 'low' | 'medium' | 'high';

export type CivicUpdateSource = 'government' | 'community' | 'automated';

export interface IAffectedArea {
  state: string;
  district?: string;
  pincode?: string;
  areaName?: string;
}

export interface ICivicUpdate extends Document {
  type: CivicUpdateType;
  title: string;
  description: string;
  affectedAreas: IAffectedArea[];
  startDate: Date;
  endDate?: Date;
  status: CivicUpdateStatus;
  severity?: CivicUpdateSeverity;
  source: CivicUpdateSource;
  contactInfo?: string;
  relatedLinks?: string[];
}

export interface ICreateCivicUpdateInput {
  type: CivicUpdateType;
  title: string;
  description: string;
  affectedAreas: IAffectedArea[];
  startDate: Date;
  endDate?: Date;
  status: CivicUpdateStatus;
  severity?: CivicUpdateSeverity;
  source: CivicUpdateSource;
  contactInfo?: string;
  relatedLinks?: string[];
}

export interface IUpdateCivicUpdateInput {
  title?: string;
  description?: string;
  status?: CivicUpdateStatus;
  endDate?: Date;
  severity?: CivicUpdateSeverity;
}

export interface ICivicUpdateFilter {
  type?: CivicUpdateType;
  status?: CivicUpdateStatus;
  severity?: CivicUpdateSeverity;
  source?: CivicUpdateSource;
  state?: string;
  district?: string;
  pincode?: string;
  areaName?: string;
  search?: string;
}