// backend/src/interfaces/contact.interface.ts
import { Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  response?: {
    text: string;
    respondedAt: Date;
    respondedBy: string;
  };
  createdAt: Date;
  updatedAt: Date;
}