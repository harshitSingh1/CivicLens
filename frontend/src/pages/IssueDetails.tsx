// src/pages/IssueDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIssueById } from '../services/issues';
import { toast } from 'react-hot-toast';
import { MapPin, AlertTriangle, Calendar, User, MessageSquare, ChevronLeft, ThumbsUp } from 'lucide-react';
import Button from '../components/Button';

const IssueDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     window.scrollTo(0, 0);
    const fetchIssue = async () => {
      try {
        const data = await getIssueById(id!);
        setIssue(data);
      } catch (error) {
        toast.error('Failed to load issue details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!issue) return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
      <h1 className="mb-2 text-2xl font-bold">Issue Not Found</h1>
      <p className="mb-6 text-gray-600">The requested issue could not be found or may have been removed.</p>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );

  return (
    <div className="max-w-4xl p-4 mx-auto md:p-6">
      <Button 
        onClick={() => navigate(-1)}
        variant="outline"
        className="flex items-center gap-2 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Issues
      </Button>

      <div className="overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl">
        {/* Issue Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                issue.severity === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                issue.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
              }`}>
                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{issue.title}</h1>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center mr-4">
                  <User className="w-4 h-4 mr-1" />
                  Reported by User
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(issue.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                Upvote ({issue.upvotes.length})
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comment
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          {/* Left Column - Description and Images */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Description</h2>
              <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">
                {issue.description}
              </p>
            </div>

            {/* Images */}
            {issue.images.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Photos</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {issue.images.map((image: string, index: number) => (
                    <div key={index} className="overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`Issue ${index + 1}`}
                        className="object-cover w-full h-48 transition-transform cursor-pointer hover:scale-105"
                        onClick={() => window.open(image, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Location Card */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Location Details
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Address</span>
                  <p className="text-gray-700 dark:text-gray-300">{issue.location.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">State</span>
                    <p className="text-gray-700 dark:text-gray-300">{issue.location.state}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">District</span>
                    <p className="text-gray-700 dark:text-gray-300">{issue.location.district}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Pincode</span>
                    <p className="text-gray-700 dark:text-gray-300">{issue.location.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Issue Status</h3>
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${
                  issue.status === 'reported' ? 'bg-yellow-500' :
                  issue.status === 'in-progress' ? 'bg-blue-500' :
                  'bg-green-500'
                }`}></div>
                <span className="capitalize">{issue.status.replace('-', ' ')}</span>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(issue.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Category Card */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Category</h3>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-100">
                {issue.category === 'other' ? 'Natural Disaster' : 
                 issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Comments</h2>
          {issue.comments.length > 0 ? (
            <div className="space-y-4">
              {/* Render comments here */}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;