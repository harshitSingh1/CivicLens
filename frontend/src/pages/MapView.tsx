import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, CheckCircle, AlertCircle, MessageSquare, Share2, ThumbsUp, X, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getIssues, upvoteIssue, addComment, deleteComment } from '../services/issues';
import { Issue } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapView: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    severity: '',
    search: ''
  });
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setSelectedIssue(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const { issues: fetchedIssues } = await getIssues();
        setIssues(fetchedIssues);
        setFilteredIssues(fetchedIssues);
      } catch (err) {
        toast.error('Failed to load issues');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = issues.filter(issue => {
      return (
        (!filters.category || issue.category === filters.category) &&
        (!filters.status || issue.status === filters.status) &&
        (!filters.severity || issue.severity === filters.severity) &&
        (!filters.search || 
          issue.title.toLowerCase().includes(filters.search.toLowerCase()) || 
          issue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          (issue.location.address && issue.location.address.toLowerCase().includes(filters.search.toLowerCase())) ||
          issue.location.district.toLowerCase().includes(filters.search.toLowerCase()) ||
          issue.location.state.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    });
    setFilteredIssues(filtered);
  }, [issues, filters]);

  // Initialize map and markers
  useEffect(() => {
    if (filteredIssues.length === 0 || !document.getElementById('map')) return;

    if (!mapRef.current) {
      const map = L.map('map', {
        preferCanvas: true,
        zoomControl: false
      }).setView([20.5937, 78.9629], 5);

      L.tileLayer(
        isDark 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      ).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapRef.current = map;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    const markerGroup = L.featureGroup();

    const geocodeAddress = async (address: string): Promise<[number, number]> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data.length > 0) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
      return [20.5937, 78.9629];
    };

    filteredIssues.forEach(async (issue) => {
  let coords: L.LatLngTuple;
  
  // Handle manual locations (coordinates [0,0])
  if (issue.location.coordinates[0] === 0 && issue.location.coordinates[1] === 0) {
    const address = issue.location.address || 
      `${issue.location.district}, ${issue.location.state}, ${issue.location.pincode}`;
    coords = await geocodeAddress(address);
    console.log(`Geocoded ${address} to coordinates:`, coords);
  } else {
    // CORRECTED: Use the stored coordinates (GeoJSON format: [lng, lat])
    // but convert to Leaflet format: [lat, lng]
    const [lng, lat] = issue.location.coordinates;
    coords = [lat, lng];
  }

  const marker = L.marker(coords, { 
    icon: defaultIcon,
    title: issue.title
  }).addTo(mapRef.current!);
      
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${issue.title}</h3>
          <p class="text-sm">${issue.description.substring(0, 50)}...</p>
          <button class="mt-2 text-sm text-blue-500" onclick="window.dispatchEvent(new CustomEvent('select-issue', { detail: '${issue._id}' }))">
            View Details
          </button>
        </div>
      `);

      marker.on('click', () => {
        setSelectedIssue(issue);
      });

      markersRef.current.push(marker);
      markerGroup.addLayer(marker);
    });

    if (markersRef.current.length > 0) {
      mapRef.current?.fitBounds(markerGroup.getBounds(), { 
        padding: [50, 50],
        maxZoom: 15
      });
    }

    const handleSelectIssue = (e: CustomEvent) => {
      const issue = filteredIssues.find(i => i._id === e.detail);
      if (issue) setSelectedIssue(issue);
    };

    window.addEventListener('select-issue', handleSelectIssue as EventListener);
    return () => {
      window.removeEventListener('select-issue', handleSelectIssue as EventListener);
    };
  }, [filteredIssues, isDark]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleUpvote = async (issueId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const updatedIssue = await upvoteIssue(issueId);
      setIssues(prev => prev.map(i => i._id === issueId ? updatedIssue : i));
      setFilteredIssues(prev => prev.map(i => i._id === issueId ? updatedIssue : i));
      if (selectedIssue?._id === issueId) setSelectedIssue(updatedIssue);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated || !selectedIssue || !newComment.trim()) return;

    try {
      const updatedIssue = await addComment(selectedIssue._id, { text: newComment });
      setIssues(prev => prev.map(i => i._id === selectedIssue._id ? updatedIssue : i));
      setFilteredIssues(prev => prev.map(i => i._id === selectedIssue._id ? updatedIssue : i));
      setSelectedIssue(updatedIssue);
      setNewComment('');
      toast.success('Comment added!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isAuthenticated || !selectedIssue) return;

    try {
      const updatedIssue = await deleteComment(selectedIssue._id, commentId);
      setIssues(prev => prev.map(i => i._id === selectedIssue._id ? updatedIssue : i));
      setFilteredIssues(prev => prev.map(i => i._id === selectedIssue._id ? updatedIssue : i));
      setSelectedIssue(updatedIssue);
      toast.success('Comment deleted!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleViewOnMap = (issue: Issue) => {
    try {
      if (issue.location.coordinates[0] === 0 && issue.location.coordinates[1] === 0) {
        const address = encodeURIComponent(
          issue.location.address || 
          `${issue.location.district}, ${issue.location.state}, ${issue.location.pincode}`
        );
        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
      } else {
        const [lng, lat] = issue.location.coordinates;
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
      }
    } catch (error) {
      console.error('Error opening map:', error);
      toast.error('Failed to open map location');
    }
  };

  const handleShare = (issue: Issue) => {
    const url = `${window.location.origin}/issues/${issue._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 md:flex-row">
      {/* Sidebar */}
      <div className="w-full overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:w-96 scrollbar-thin">
        <div className="p-4">
          <h1 className="mb-4 text-xl font-bold dark:text-white">CivicLens Map</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full py-2 pl-10 pr-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Category</label>
              <select
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                <option value="pothole">Potholes</option>
                <option value="light">Lighting</option>
                <option value="garbage">Garbage</option>
                <option value="water">Water</option>
                <option value="traffic">Traffic</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Status</label>
              <select
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Severity</label>
              <select
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filters.severity}
                onChange={(e) => setFilters({...filters, severity: e.target.value})}
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredIssues.length} of {issues.length} issues
          </div>
        </div>

        {/* Issue List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 scrollbar-thin">
          {filteredIssues.map(issue => (
            <div
              key={issue._id}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedIssue?._id === issue._id ? 'bg-blue-50 dark:bg-gray-600' : ''
              }`}
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium dark:text-white">{issue.title}</h3>
                <div className="flex items-center">
                  {issue.status === 'reported' ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : issue.status === 'in-progress' ? (
                    <Clock className="w-4 h-4 text-yellow-500" />
                  ) : issue.status === 'resolved' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>

              <p className="mb-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {issue.description}
              </p>

              {issue.images.length > 0 && (
                <img
                  src={issue.images[0]}
                  alt="Issue"
                  className="object-cover w-full h-24 mb-2 rounded"
                />
              )}

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  issue.severity === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  issue.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {issue.severity}
                </span>

                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3 mr-1" />
                  {issue.location.address?.split(',')[0] || issue.location.district}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {issue.upvotes.length} upvotes • {new Date(issue.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(issue._id);
                    }}
                    className={`${issue.upvotes.includes(user?._id || '') ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIssue(issue);
                    }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(issue);
                    }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <div id="map" className="absolute inset-0 z-0"></div>

        {/* Selected Issue Panel */}
        {selectedIssue && (
          <div 
            ref={panelRef}
            className="absolute left-0 right-0 z-10 w-full p-4 mx-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 top-4 md:mx-0 md:left-4 md:right-auto md:max-w-md dark:border-gray-700 scrollbar-thin"
            style={{ 
              maxHeight: 'calc(100vh - 8rem)',
              bottom: '4rem'
            }}
          >
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold dark:text-white">{selectedIssue.title}</h3>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            <div className="flex-1 overflow-y-auto">
                {/* Status and Severity */}
                <div className="flex mb-2 space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedIssue.status === 'reported' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                selectedIssue.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                selectedIssue.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {selectedIssue.status}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedIssue.severity === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                selectedIssue.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                selectedIssue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {selectedIssue.severity}
              </span>
            </div>

            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{selectedIssue.description}</p>

            {selectedIssue.images.length > 0 && (
                  <img
                    src={selectedIssue.images[0]}
                    alt="Issue"
                    className="object-cover w-full h-32 mb-3 rounded"
                  />
                )}

            <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedIssue.location.address || `${selectedIssue.location.district}, ${selectedIssue.location.state}`}
                </div>

            <button
                  onClick={() => handleViewOnMap(selectedIssue)}
                  className="w-full py-2 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  View on Map
                </button>

             {/* Comments Section - Made more responsive */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="mb-2 font-medium dark:text-white">Comments ({selectedIssue.comments.length})</h4>

                  <div className="mb-3 space-y-3 max-h-[200px] overflow-y-auto scrollbar-thin">
                    {selectedIssue.comments.map(comment => (
                      <div key={comment._id} className="relative group">
                        <div className="flex items-baseline justify-between">
                          <div className="font-medium dark:text-white">
                            {typeof comment.userId === 'object' ? comment.userId.name : 'Anonymous'}
                            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}, {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          {isAuthenticated && user && (
                            (typeof comment.userId === 'object' 
                              ? comment.userId._id === user._id 
                              : comment.userId === user._id) && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-gray-400 transition-colors hover:text-red-500"
                                title="Delete comment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input - Stays at bottom */}
                  <div className="sticky bottom-0 pt-2 bg-white dark:bg-gray-800">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:bg-gray-300 dark:bg-blue-600 dark:disabled:bg-gray-600"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with upvotes and share */}
              <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Reported {new Date(selectedIssue.createdAt).toLocaleDateString()} • {selectedIssue.upvotes.length} upvotes
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpvote(selectedIssue._id)}
                    className={`${selectedIssue.upvotes.includes(user?._id || '') ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare(selectedIssue)}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;