// src/pages/CivicUpdates.tsx
import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Calendar, Construction, Bolt, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

const CivicUpdates: React.FC = () => {
  useAuth();
  const [updates, setUpdates] = useState<CivicUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<CivicUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState({
    state: '',
    district: '',
    pincode: '',
    areaName: ''
  });
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);

  // Fetch all civic updates
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const response = await api.get('/civic-updates');
        setUpdates(response.data.data);
        setFilteredUpdates(response.data.data);
      } catch (error) {
        toast.error('Failed to load civic updates');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...updates];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(update => 
        update.title.toLowerCase().includes(query) || 
        update.description.toLowerCase().includes(query) ||
        update.affectedAreas.some(area => 
          area.state.toLowerCase().includes(query) ||
          (area.district && area.district.toLowerCase().includes(query)) ||
          (area.pincode && area.pincode.toLowerCase().includes(query)) ||
          (area.areaName && area.areaName.toLowerCase().includes(query))
        )
      );
    }

    // Apply location filters
    if (locationFilter.state) {
      results = results.filter(update => 
        update.affectedAreas.some(area => 
          area.state.toLowerCase().includes(locationFilter.state.toLowerCase())
        )
      );
    }
    if (locationFilter.district) {
      results = results.filter(update => 
        update.affectedAreas.some(area => 
          area.district && area.district.toLowerCase().includes(locationFilter.district.toLowerCase())
        )
      );
    }
    if (locationFilter.pincode) {
      results = results.filter(update => 
        update.affectedAreas.some(area => 
          area.pincode && area.pincode.includes(locationFilter.pincode)
        )
      );
    }
    if (locationFilter.areaName) {
      results = results.filter(update => 
        update.affectedAreas.some(area => 
          area.areaName && area.areaName.toLowerCase().includes(locationFilter.areaName.toLowerCase())
        )
      );
    }

    // Apply type filter
    if (typeFilter) {
      results = results.filter(update => update.type === typeFilter);
    }

    setFilteredUpdates(results);
  }, [updates, searchQuery, locationFilter, typeFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hazard':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'project':
        return <Construction className="w-5 h-5 text-blue-500" />;
      case 'utility':
        return <Bolt className="w-5 h-5 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Calendar className="w-5 h-5 text-green-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hazard': return 'Hazard';
      case 'project': return 'Project';
      case 'utility': return 'Utility';
      case 'alert': return 'Alert';
      case 'event': return 'Event';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Civic Updates & Public Notices
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay informed about events, hazards, and projects in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="p-6 mb-8 bg-white shadow-md dark:bg-gray-800 rounded-xl">
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search updates..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <select
                className="flex-1 p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="event">Events</option>
                <option value="hazard">Hazards</option>
                <option value="project">Projects</option>
                <option value="alert">Alerts</option>
                <option value="utility">Utilities</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
              <input
                type="text"
                placeholder="State"
                className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={locationFilter.state}
                onChange={(e) => setLocationFilter({...locationFilter, state: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">District</label>
              <input
                type="text"
                placeholder="District"
                className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={locationFilter.district}
                onChange={(e) => setLocationFilter({...locationFilter, district: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
              <input
                type="text"
                placeholder="Pincode"
                className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={locationFilter.pincode}
                onChange={(e) => setLocationFilter({...locationFilter, pincode: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Area Name</label>
              <input
                type="text"
                placeholder="Area Name"
                className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={locationFilter.areaName}
                onChange={(e) => setLocationFilter({...locationFilter, areaName: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {filteredUpdates.length} Updates Found
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="p-8 text-center bg-white shadow-md dark:bg-gray-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-300">No updates match your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <motion.div
                key={update._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedUpdate(expandedUpdate === update._id ? null : update._id)}
                >
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
                            {getTypeLabel(update.type)}
                          </span>
                          {update.severity && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              update.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              update.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {update.severity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        expandedUpdate === update._id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {expandedUpdate === update._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4"
                      >
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-gray-700 dark:text-gray-300">{update.description}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                          <div>
                            <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Affected Areas</h4>
                            <ul className="space-y-1">
                              {update.affectedAreas.map((area, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
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

                            {update.contactInfo && (
                              <>
                                <h4 className="mt-3 mb-1 text-sm font-medium text-gray-900 dark:text-white">Contact</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{update.contactInfo}</p>
                              </>
                            )}
                          </div>
                        </div>

                        {update.relatedLinks && update.relatedLinks.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Related Links</h4>
                            <div className="flex flex-wrap gap-2">
                              {update.relatedLinks.map((link, index) => (
                                <a
                                  key={index}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Link {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CivicUpdates;