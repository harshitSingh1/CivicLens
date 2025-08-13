// src/pages/Settings.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, XCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

const handlePasswordUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage(null);

  // Add debug logs
  console.log('New Password:', newPassword);
  console.log('Confirm Password:', confirmPassword);
  
  if (newPassword !== confirmPassword) {
    console.log('Password mismatch detected');
    setMessage({ text: 'Passwords do not match', type: 'error' });
    setIsLoading(false);
    return;
  }

  try {
    await updatePassword(currentPassword, newPassword);
    setMessage({ text: 'Password updated successfully', type: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (error) {
    console.error('Password update error:', error);
    setMessage({ 
      text: 'Failed to update password. Please check your current password.', 
      type: 'error' 
    });
  } finally {
    setIsLoading(false);
  }
};
  if (!user) return null;

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        
        <div className="space-y-8">
          {/* Change Password */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="p-6 bg-white rounded-lg shadow dark:bg-gray-800"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              <Lock className="inline w-5 h-5 mr-2" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {message && (
                <div className={`p-3 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  <div className="flex items-center">
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    {message.text}
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value.trim())}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value.trim())}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.trim())}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;