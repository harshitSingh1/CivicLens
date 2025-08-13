// src/services/users.service.ts
import User from '../models/users.model';
import { NotFoundError, UnauthorizedError } from '../utils/apiError';

const updateUserProfile = async (userId: string, updateData: { name?: string; email?: string }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new NotFoundError('User not found');
  }

  console.log('Comparing passwords...');
  console.log('Provided current password:', currentPassword);
  console.log('Stored password hash:', user.password);

  const isMatch = await user.comparePassword(currentPassword);
  console.log('Password match result:', isMatch);

  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  console.log('Password updated successfully');
};

export { updateUserProfile, changeUserPassword };