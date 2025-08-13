import React, { useState, useEffect, useCallback } from 'react';
import { Upload, MapPin, Camera, ChevronDown } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { createIssue } from '../services/issues';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ReportIssue: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'medium',
    email: '',
    images: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{
    coordinates: [number, number];
    state: string;
    district: string;
    pincode: string;
    address?: string;
  } | null>(null);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    state: '',
    district: '',
    pincode: '',
    address: '',
  });
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null);

  const categories = [
    { value: 'pothole', label: 'Potholes & Road Issues' },
    { value: 'light', label: 'Street Lighting' },
    { value: 'garbage', label: 'Waste Management' },
    { value: 'water', label: 'Water Supply' },
    { value: 'traffic', label: 'Traffic Issues' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  // Check location permission status
  useEffect(() => {
     window.scrollTo(0, 0);
    const checkPermission = async () => {
      try {
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
          setLocationPermission(permissionStatus.state);
          permissionStatus.onchange = () => {
            setLocationPermission(permissionStatus.state);
          };
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    };

    checkPermission();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleManualLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualLocation(prev => ({ ...prev, [name]: value }));
  };

  const saveManualLocation = () => {
    try {
      if (!manualLocation.state || !manualLocation.district || !manualLocation.pincode) {
        throw new Error('Please fill in all required location fields');
      }

      setLocation({
        coordinates: [0, 0],
        state: manualLocation.state,
        district: manualLocation.district,
        pincode: manualLocation.pincode,
        address: manualLocation.address || `${manualLocation.district}, ${manualLocation.state}`,
      });
      setShowManualLocation(false);
      toast.success('Manual location saved');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save manual location');
      }
    }
  };

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setShowManualLocation(true);
      return;
    }

    setIsSubmitting(true);
    toast.loading('Getting your location...', { id: 'location-loading' });

    try {
      // First try with high accuracy
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      
      if (!data.address) {
        throw new Error('Could not determine address from coordinates');
      }

      setLocation({
        coordinates: [longitude, latitude],
        state: data.address.state || 'Unknown',
        district: data.address.county || data.address.city || 'Unknown',
        pincode: data.address.postcode || '000000',
        address: data.display_name,
      });
      
      toast.success('Location captured successfully!', { id: 'location-loading' });
    } catch (error) {
      console.error('High accuracy location failed, trying with lower accuracy...', error);
      
      // Fallback to lower accuracy
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
          );
        });

        const { latitude, longitude } = position.coords;
        
        setLocation({
          coordinates: [longitude, latitude],
          state: 'Unknown',
          district: 'Unknown',
          pincode: '000000',
          address: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        });
        toast.success('Approximate location captured', { id: 'location-loading' });
      } catch (fallbackError) {
        console.error('Fallback geolocation error:', fallbackError);
        toast.error('Could not determine your location. Please enter it manually.', { 
          id: 'location-loading',
          duration: 5000
        });
        setShowManualLocation(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/report' } });
      return;
    }

    if (!location) {
      toast.error('Please set the location first');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        location: {
          coordinates: location.coordinates,
          state: location.state,
          district: location.district,
          pincode: location.pincode,
          address: location.address || `${location.district}, ${location.state}`
        }
      };

      const createdIssue = await createIssue(issueData, formData.images);

      toast.success(
        (t) => (
          <div>
            <p>Issue reported successfully!</p>
            <button
              onClick={() => {
                navigate(`/issues/${createdIssue._id}`);
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 mt-2 text-sm text-white transition bg-blue-600 rounded hover:bg-blue-700"
            >
              View Issue
            </button>
          </div>
        ),
        {
          duration: 10000,
          style: {
            minWidth: '300px',
          },
        }
      );

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        severity: 'medium',
        email: '',
        images: [],
      });
      setLocation(null);
      setManualLocation({
        state: '',
        district: '',
        pincode: '',
        address: ''
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit issue';
      
      toast.error(errorMessage, {
        duration: 5000
      });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            Report a Community Issue
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Help make your community better by reporting issues that need attention.
          </p>
        </div>

        <div className="p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Brief description of the issue"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Provide more details about the issue, including when you noticed it and any relevant context"
              />
            </div>

            {/* Category and Severity */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Issue Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="severity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Urgency Level *
                </label>
                <select
                  id="severity"
                  name="severity"
                  required
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select urgency</option>
                  {severityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Location *
              </label>
              <div className="flex items-center mb-4 space-x-4">
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  variant="outline"
                  className="flex items-center"
                  disabled={isSubmitting || locationPermission === 'denied'}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Getting location...' : 'Get Current Location'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowManualLocation(!showManualLocation)}
                  variant="outline"
                  className="flex items-center"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  {showManualLocation ? 'Hide Manual Input' : 'Enter Manually'}
                </Button>
                {location && !showManualLocation && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location captured
                  </div>
                )}
              </div>

              {showManualLocation && (
                <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={manualLocation.state}
                        onChange={handleManualLocationChange}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        District *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={manualLocation.district}
                        onChange={handleManualLocationChange}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                        placeholder="Enter district/city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={manualLocation.pincode}
                        onChange={handleManualLocationChange}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                        placeholder="Enter pincode"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address (Optional)
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={manualLocation.address}
                        onChange={handleManualLocationChange}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                        placeholder="Detailed address"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={saveManualLocation}
                    className="px-4 py-2"
                  >
                    Save Location
                  </Button>
                </div>
              )}

              {location && (
                <div className="p-3 mt-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {location.address || `${location.district}, ${location.state}`}
                  </p>
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    State: {location.state} | District: {location.district} | Pincode: {location.pincode}
                  </p>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Photos (Optional)
              </label>
              <div className="p-6 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="block mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Click to upload photos
                      </span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="object-cover w-full h-24 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="your.email@example.com"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Receive updates about this issue
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !location}
                className="px-8 py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;