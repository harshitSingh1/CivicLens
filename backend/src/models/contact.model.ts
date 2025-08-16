// backend/src/models/contact.model.ts
import mongoose, { Schema } from 'mongoose';
import { IContact } from '../interfaces/contact.interface';

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['general', 'support', 'partnership', 'government', 'press', 'feedback'],
    default: 'general'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'spam'],
    default: 'new'
  },
  response: {
    text: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId as any,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;