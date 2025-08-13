import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../interfaces/auth.interface';
import bcrypt from 'bcryptjs';

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'authority'],
      default: 'user',
    },
    profilePicture: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    level: {
      type: Number,
      default: 1,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    location: {
      state: String,
      district: String,
      pincode: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.method('comparePassword', async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;