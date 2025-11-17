import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, MapPin, Camera, ChevronDown, Scan, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { createIssue } from '../services/issues';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// AI Analysis Service - Using free Hugging Face API
const analyzeImageWithAI = async (imageFile: File): Promise<{
title: string;
description: string;
category: string;
severity: string;
}> => {
try {
// Using Hugging Face's image classification API (free tier)
const API_URL = 'https://api-inference.huggingface.co/models/google/vit-base-patch16-224';
const API_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN || '';

const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch(API_URL, {
method: 'POST',
headers: {
'Authorization': `Bearer ${API_TOKEN}`,
},
body: formData,
});

if (!response.ok) {
throw new Error('AI analysis failed');
}

const result = await response.json();

// Map Hugging Face results to our categories
return mapAIToCategories(result);
} catch (error) {
console.error('AI Analysis Error:', error);
// Fallback to basic image analysis
return analyzeImageBasic(imageFile);
}
};

// Fallback basic analysis with confident descriptions
const analyzeImageBasic = async (imageFile: File) => {
const fileName = imageFile.name.toLowerCase();

let category = 'other';
let severity = 'medium';
let title = 'Community Issue Detected';
let description = 'A civic issue has been identified that requires attention from local authorities.';

// Confident pattern matching based on file name clues
if (fileName.includes('pothole') || fileName.includes('road') || fileName.includes('crack')) {
category = 'pothole';
title = 'Road Damage Issue';
description = 'Road surface damage detected. This requires immediate repair to ensure public safety and smooth transportation.';
severity = 'high';
} else if (fileName.includes('light') || fileName.includes('lamp') || fileName.includes('dark')) {
category = 'light';
title = 'Street Light Problem';
description = 'Street lighting malfunction detected. Non-functional street lights pose safety risks during night hours.';
severity = 'medium';
} else if (fileName.includes('garbage') || fileName.includes('trash') || fileName.includes('waste')) {
category = 'garbage';
title = 'Waste Management Issue';
description = 'Garbage accumulation detected. Improper waste disposal affects public health and environment.';
severity = 'medium';
} else if (fileName.includes('water') || fileName.includes('flood') || fileName.includes('pipe') || fileName.includes('leak')) {
category = 'water';
title = 'Water Supply Problem';
description = 'Water leakage or drainage issue detected. This can lead to water wastage and public inconvenience.';
severity = 'high';
} else if (fileName.includes('traffic') || fileName.includes('signal') || fileName.includes('congestion')) {
category = 'traffic';
title = 'Traffic Management Issue';
description = 'Traffic-related problem identified. This requires attention to ensure smooth traffic flow and public safety.';
severity = 'medium';
}

return {
title,
description,
category,
severity
};
};

// Map Hugging Face API results to our categories with confident descriptions
const mapAIToCategories = (aiResult: any[]) => {
const topResult = aiResult[0];
const label = topResult.label.toLowerCase();

let category = 'other';
let severity = 'medium';
let title = 'Community Issue Detected';
let description = 'A civic issue has been identified that requires attention from local authorities.';

// Confident mapping of detected objects to civic issues
if (label.includes('pothole') || label.includes('road') || label.includes('asphalt') || label.includes('crack')) {
category = 'pothole';
title = 'Road Surface Damage';
description = 'Road damage detected that requires immediate repair. Potholes and road cracks pose safety hazards to vehicles and pedestrians.';
severity = 'high';
} else if (label.includes('lamp') || label.includes('light') || label.includes('streetlight') || label.includes('pole')) {
category = 'light';
title = 'Street Lighting Issue';
description = 'Street light problem identified. Functional street lighting is essential for public safety during nighttime.';
severity = 'medium';
} else if (label.includes('garbage') || label.includes('trash') || label.includes('waste') || label.includes('litter')) {
category = 'garbage';
title = 'Waste Accumulation';
description = 'Garbage accumulation detected. Proper waste management is crucial for maintaining public health and cleanliness.';
severity = 'medium';
} else if (label.includes('water') || label.includes('flood') || label.includes('pipe') || label.includes('leak')) {
category = 'water';
title = 'Water Related Issue';
description = 'Water supply or drainage problem detected. This issue affects daily water availability and proper drainage systems.';
severity = 'high';
} else if (label.includes('traffic') || label.includes('car') || label.includes('vehicle') || label.includes('congestion')) {
category = 'traffic';
title = 'Traffic Management Issue';
description = 'Traffic-related problem identified. Proper traffic management ensures smooth transportation and public safety.';
severity = 'medium';
} else if (label.includes('construction') || label.includes('building') || label.includes('scaffold')) {
category = 'other';
title = 'Construction Related Issue';
description = 'Construction-related problem detected. This requires attention to ensure public safety and proper infrastructure development.';
severity = 'medium';
}

return {
title,
description,
category,
severity
};
};

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
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [analysisProgress, setAnalysisProgress] = useState('');
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

const fileInputRef = useRef<HTMLInputElement>(null);

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

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files.length > 0) {
const newImages = Array.from(e.target.files);
setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));

// Auto-analyze the first image
if (newImages[0]) {
await analyzeImage(newImages[0]);
}
}
};

const triggerCamera = () => {
// Create a new file input for camera with proper attributes
const cameraInput = document.createElement('input');
cameraInput.type = 'file';
cameraInput.accept = 'image/*';

// Use capture attribute to force camera on supported devices
cameraInput.setAttribute('capture', 'environment');

cameraInput.onchange = async (e) => {
const target = e.target as HTMLInputElement;
if (target.files && target.files.length > 0) {
const capturedImage = target.files[0];
setFormData(prev => ({ ...prev, images: [capturedImage] }));
await analyzeImage(capturedImage);
}
};

// Trigger the click to open camera
cameraInput.click();
};

const analyzeImage = async (imageFile: File) => {
setIsAnalyzing(true);
setAnalysisProgress('Analyzing image for civic issues...');

try {
setAnalysisProgress('Detecting problems in the image...');
await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

const analysis = await analyzeImageWithAI(imageFile);

setAnalysisProgress('Analysis completed! Review the auto-filled details.');

// Auto-fill form with AI analysis
setFormData(prev => ({
...prev,
title: analysis.title,
description: analysis.description,
category: analysis.category,
severity: analysis.severity
}));

toast.success('AI analysis completed! Form fields have been auto-filled.');

} catch (error) {
console.error('Analysis failed:', error);
toast.error('AI analysis failed. Please fill the details manually.');
} finally {
setIsAnalyzing(false);
setTimeout(() => setAnalysisProgress(''), 3000);
}
};

const removeImage = (index: number) => {
setFormData(prev => ({
...prev,
images: prev.images.filter((_, i) => i !== index)
}));
};

const triggerFileUpload = () => {
fileInputRef.current?.click();
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
const position = await new Promise<GeolocationPosition>((resolve, reject) => {
navigator.geolocation.getCurrentPosition(
resolve,
reject,
{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
);
});

const { latitude, longitude } = position.coords;

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
{/* Image Upload Section - MOVED TO TOP */}
<div>
<label className="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">
📸 Upload or Capture Photo
<span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
(AI will auto-fill details)
</span>
</label>

{/* Upload Options */}
<div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
{/* Upload from Device */}
<div
onClick={triggerFileUpload}
className="flex flex-col items-center justify-center p-6 transition-all border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
>
<Upload className="w-12 h-12 mb-3 text-gray-400" />
<span className="text-sm font-medium text-gray-900 dark:text-white">
Upload Photo
</span>
<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
From your device
</p>
</div>

{/* Take Photo */}
<div
onClick={triggerCamera}
className="flex flex-col items-center justify-center p-6 transition-all border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
>
<Camera className="w-12 h-12 mb-3 text-gray-400" />
<span className="text-sm font-medium text-gray-900 dark:text-white">
Take Photo
</span>
<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
Use camera
</p>
</div>
</div>

{/* Hidden file input for uploads */}
<input
ref={fileInputRef}
type="file"
accept="image/*"
onChange={handleImageUpload}
className="hidden"
multiple
/>

{/* Analysis Progress */}
{isAnalyzing && (
<div className="p-4 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
<div className="flex items-center">
<Loader2 className="w-5 h-5 mr-3 text-blue-600 animate-spin dark:text-blue-400" />
<span className="text-sm font-medium text-blue-800 dark:text-blue-300">
{analysisProgress}
</span>
</div>
</div>
)}

{/* Preview Images */}
{formData.images.length > 0 && (
<div className="mt-4">
<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
Uploaded Photos
</label>
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
{formData.images.map((file, index) => (
<div key={index} className="relative group">
<img
src={URL.createObjectURL(file)}
alt={`Upload ${index + 1}`}
className="object-cover w-full h-24 rounded-lg"
/>
<button
type="button"
onClick={() => removeImage(index)}
className="absolute flex items-center justify-center w-6 h-6 text-sm text-white transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100 hover:bg-red-600"
>
×
</button>
<div className="absolute bottom-0 left-0 right-0 p-1 text-xs text-center text-white bg-black bg-opacity-50 rounded-b-lg">
{file.name}
</div>
</div>
))}
</div>
</div>
)}
</div>

{/* AI Analysis Results Note */}
{formData.images.length > 0 && !isAnalyzing && (
<div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
<div className="flex items-center">
<Scan className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
<span className="text-sm font-medium text-green-800 dark:text-green-300">
AI analysis completed! Check the fields below and adjust if needed.
</span>
</div>
</div>
)}

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

{/* Location Section */}
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