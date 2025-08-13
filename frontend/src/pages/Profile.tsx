// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/Avatar';
import { motion } from 'framer-motion';
import { Award, BarChart2, Shield, Calendar, Edit, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      await updateUser({
        name: editedName,
        email: editedEmail
      });
      setIsEditing(false);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white rounded-lg shadow dark:bg-gray-800"
            >
              <div className="flex flex-col items-center">
                <Avatar 
                  src={user.profilePicture} 
                  name={user.name} 
                  size="lg"
                />
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-2 mb-2 text-lg font-semibold text-center bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-4 py-2 text-sm text-center text-gray-600 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  </>
                )}
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.role === 'admin' ? 'Administrator' : 'Community Member'}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid gap-6"
            >
              {/* User Stats */}
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center">
                      <Award className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">Level</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold">{user.level || 1}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center">
                      <BarChart2 className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">Points</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold">{user.points || 0}</div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                      <p className="font-medium">
                        {user.verified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;