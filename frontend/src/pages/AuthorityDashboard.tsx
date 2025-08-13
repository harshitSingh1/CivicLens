// src/pages/AuthorityDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, AlertTriangle, Calendar, Construction, Bolt, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface CivicUpdate {
  _id: string;
  type: 'event' | 'hazard' | 'project' | 'alert' | 'utility';
  title: string;
  description: string;
  affectedAreas: {
    state: string;
    district?: string;
    pincode?: string;
    areaName?: string;
  }[];
  startDate: string;
  endDate?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  severity?: 'low' | 'medium' | 'high';
  source: 'government' | 'community' | 'automated';
  contactInfo?: string;
  relatedLinks?: string[];
}

interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'reported' | 'in-progress' | 'resolved' | 'rejected';
  severity: 'low' | 'medium' | 'high' | 'urgent';
  location: {
    state: string;
    district: string;
    pincode: string;
    address?: string;
  };
}

interface FormData {
  type: 'event' | 'hazard' | 'project' | 'alert' | 'utility';
  title: string;
  description: string;
  affectedAreas: {
    state: string;
    district: string;
    pincode: string;
    areaName: string;
  }[];
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  severity: 'low' | 'medium' | 'high';
  source: 'government' | 'community' | 'automated';
  contactInfo: string;
  relatedLinks: string[];
}

const AuthorityDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('updates');
  const [updates, setUpdates] = useState<CivicUpdate[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState<CivicUpdate | null>(null);
const [formData, setFormData] = useState<FormData>({
  type: 'event',
  title: '',
  description: '',
  affectedAreas: [{ state: '', district: '', pincode: '', areaName: '' }],
  startDate: '',
  endDate: '',
  status: 'upcoming',
  severity: 'medium',
  source: 'government',
  contactInfo: '',
  relatedLinks: ['']
});

  // Check if user is authorized
  useEffect(() => {
     window.scrollTo(0, 0);
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'authority') {
      navigate('/');
      toast.error('You are not authorized to access this page');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'updates') {
          const response = await api.get('/civic-updates');
          setUpdates(response.data.data);
        } else {
          const response = await api.get('/issues');
          setIssues(response.data.data.issues);
        }
      } catch (error) {
        toast.error(`Failed to load ${activeTab}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAreaChange = (index: number, field: string, value: string) => {
    const newAreas = [...formData.affectedAreas];
    newAreas[index] = { ...newAreas[index], [field]: value };
    setFormData({ ...formData, affectedAreas: newAreas });
  };

  const addArea = () => {
    setFormData({
      ...formData,
      affectedAreas: [...formData.affectedAreas, { state: '', district: '', pincode: '', areaName: '' }]
    });
  };

  const removeArea = (index: number) => {
    const newAreas = [...formData.affectedAreas];
    newAreas.splice(index, 1);
    setFormData({ ...formData, affectedAreas: newAreas });
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.relatedLinks];
    newLinks[index] = value;
    setFormData({ ...formData, relatedLinks: newLinks });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      relatedLinks: [...formData.relatedLinks, '']
    });
  };

  const removeLink = (index: number) => {
    const newLinks = [...formData.relatedLinks];
    newLinks.splice(index, 1);
    setFormData({ ...formData, relatedLinks: newLinks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        affectedAreas: formData.affectedAreas.filter(area => area.state.trim() !== ''),
        relatedLinks: formData.relatedLinks.filter(link => link.trim() !== ''),
        endDate: formData.endDate || undefined
      };

      if (currentUpdate) {
        await api.patch(`/civic-updates/${currentUpdate._id}`, payload);
        toast.success('Update modified successfully');
      } else {
        await api.post('/civic-updates', payload);
        toast.success('Update created successfully');
      }

      // Refresh data
      const response = await api.get('/civic-updates');
      setUpdates(response.data.data);
      setShowUpdateForm(false);
      setCurrentUpdate(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to save update');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const resetForm = () => {
  setFormData({
    type: 'event',
    title: '',
    description: '',
    affectedAreas: [{ state: '', district: '', pincode: '', areaName: '' }],
    startDate: '',
    endDate: '',
    status: 'upcoming',
    severity: 'medium',
    source: 'government',
    contactInfo: '',
    relatedLinks: ['']
  });
};

const handleEdit = (update: CivicUpdate) => {
  setCurrentUpdate(update);
  setFormData({
    type: update.type,
    title: update.title,
    description: update.description,
    affectedAreas: update.affectedAreas.map(area => ({
      state: area.state,
      district: area.district || '',
      pincode: area.pincode || '',
      areaName: area.areaName || ''
    })),
    startDate: update.startDate.split('T')[0],
    endDate: update.endDate ? update.endDate.split('T')[0] : '',
    status: update.status,
    severity: update.severity || 'medium',
    source: update.source,
    contactInfo: update.contactInfo || '',
    relatedLinks: update.relatedLinks || ['']
  });
  setShowUpdateForm(true);
};

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      try {
        setLoading(true);
        await api.delete(`/civic-updates/${id}`);
        toast.success('Update deleted successfully');
        setUpdates(updates.filter(update => update._id !== id));
      } catch (error) {
        toast.error('Failed to delete update');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateIssueStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      await api.patch(`/issues/${id}`, { status });
      toast.success('Issue status updated');
      const response = await api.get('/issues');
      setIssues(response.data.data.issues);
    } catch (error) {
      toast.error('Failed to update issue status');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hazard': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'project': return <Construction className="w-5 h-5 text-blue-500" />;
      case 'utility': return <Bolt className="w-5 h-5 text-yellow-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Calendar className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'reported': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Authority Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage civic updates and community issues
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('updates')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'updates'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Civic Updates
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'issues'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Reported Issues
            </button>
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'updates' ? (
              <>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => {
                      setCurrentUpdate(null);
                      resetForm();
                      setShowUpdateForm(true);
                    }}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Update
                  </button>
                </div>

                {updates.length === 0 ? (
                  <div className="p-8 text-center bg-white shadow-md dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-300">No civic updates found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <motion.div
                        key={update._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="mt-1">
                                {getTypeIcon(update.type)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {update.title}
                                </h3>
                                <div className="flex flex-wrap items-center mt-1 space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(update.status)}`}>
                                    {update.status}
                                  </span>
                                  <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200">
                                    {update.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(update)}
                                className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(update._id)}
                                className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300">{update.description}</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                            <div>
                              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Affected Areas</h4>
                              <ul className="space-y-1">
                                {update.affectedAreas.map((area, index) => (
                                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                    {[area.areaName, area.district, area.state].filter(Boolean).join(', ')}
                                    {area.pincode && ` (${area.pincode})`}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Timeline</h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Start: {new Date(update.startDate).toLocaleDateString()}</p>
                                {update.endDate && (
                                  <p>End: {new Date(update.endDate).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {issues.length} Reported Issues
                  </h2>
                </div>

                {issues.length === 0 ? (
                  <div className="p-8 text-center bg-white shadow-md dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-300">No issues found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <motion.div
                        key={issue._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {issue.title}
                              </h3>
                              <div className="flex flex-wrap items-center mt-1 space-x-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                                  {issue.status}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  issue.severity === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  issue.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                  issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                  {issue.severity}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="mt-2 text-gray-700 dark:text-gray-300">{issue.description}</p>

                          <div className="mt-4">
                            <h4 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">Location</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {issue.location.address || `${issue.location.district}, ${issue.location.state}`}
                            </p>
                          </div>

                          <div className="flex mt-4 space-x-2">
                            <button
                              onClick={() => updateIssueStatus(issue._id, 'in-progress')}
                              disabled={issue.status === 'in-progress'}
                              className={`px-3 py-1 text-sm rounded-lg flex items-center ${
                                issue.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                              }`}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              In Progress
                            </button>
                            <button
                              onClick={() => updateIssueStatus(issue._id, 'resolved')}
                              disabled={issue.status === 'resolved'}
                              className={`px-3 py-1 text-sm rounded-lg flex items-center ${
                                issue.status === 'resolved'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20'
                              }`}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Resolved
                            </button>
                            <button
                              onClick={() => updateIssueStatus(issue._id, 'rejected')}
                              disabled={issue.status === 'rejected'}
                              className={`px-3 py-1 text-sm rounded-lg flex items-center ${
                                issue.status === 'rejected'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20'
                              }`}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Update Form Modal */}
      <AnimatePresence>
        {showUpdateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentUpdate ? 'Edit Civic Update' : 'Create New Civic Update'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowUpdateForm(false);
                      setCurrentUpdate(null);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type*
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="event">Event</option>
                        <option value="hazard">Hazard</option>
                        <option value="project">Project</option>
                        <option value="alert">Alert</option>
                        <option value="utility">Utility</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status*
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title*
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Severity
                      </label>
                      <select
                        name="severity"
                        value={formData.severity}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Start Date*
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Affected Areas*
                      </label>
                      <button
                        type="button"
                        onClick={addArea}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Add Area
                      </button>
                    </div>

                    {formData.affectedAreas.map((area, index) => (
                      <div key={index} className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
                        <div>
                          <input
                            type="text"
                            placeholder="State*"
                            value={area.state}
                            onChange={(e) => handleAreaChange(index, 'state', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="District"
                            value={area.district}
                            onChange={(e) => handleAreaChange(index, 'district', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Pincode"
                            value={area.pincode}
                            onChange={(e) => handleAreaChange(index, 'pincode', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="Area Name"
                            value={area.areaName}
                            onChange={(e) => handleAreaChange(index, 'areaName', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          {formData.affectedAreas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArea(index)}
                              className="p-2 ml-2 text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      placeholder="Phone/Email for more info"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Related Links
                      </label>
                      <button
                        type="button"
                        onClick={addLink}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Add Link
                      </button>
                    </div>

                    {formData.relatedLinks.map((link, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={link}
                          onChange={(e) => handleLinkChange(index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {formData.relatedLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className="p-2 ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpdateForm(false);
                        setCurrentUpdate(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : currentUpdate ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthorityDashboard;