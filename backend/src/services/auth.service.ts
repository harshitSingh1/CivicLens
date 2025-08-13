import jwt from 'jsonwebtoken';
import config from '../config/env';
import User from '../models/users.model';
import { ILoginResponse, IRegisterInput } from '../interfaces/auth.interface';
import { ConflictError, UnauthorizedError } from '../utils/apiError';

const register = async (userData: IRegisterInput) => {
  if (await User.findOne({ email: userData.email })) {
    throw new ConflictError('Email already taken');
  }

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'user',
  });

  return user.toObject();
};

const login = async (email: string, password: string): Promise<ILoginResponse> => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  const token = jwt.sign(
    { id: user._id.toString() },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expire,
      algorithm: 'HS256'
    } as jwt.SignOptions
  );
   console.log('Login successful - Token:', token);
  console.log('User:', user);

  // Create response object without Mongoose methods
  const responseUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    points: user.points,
    badges: user.badges,
    level: user.level,
    verified: user.verified,
    location: user.location,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: responseUser,
    tokens: {
      access: {
        token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
  };
};

const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw new UnauthorizedError('User not found');
  return user;
};

export { register, login, getCurrentUser };