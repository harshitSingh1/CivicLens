import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, 
  CheckCircle, AlertTriangle, 
  BarChart3, MapPin, RefreshCw 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, LineChart, Line, PieChart, Pie, 
  Cell, ResponsiveContainer, Legend 
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  unresolvedIssues: number;
  resolutionRate: number;
  topContributors: {
    name: string;
    profilePicture?: string;
    points: number;
    badges: string[];
  }[];
  recentUpdates: {
    title: string;
    type: string;
    createdAt: string;
  }[];
  issuesByCategory: { _id: string; count: number }[];
  issuesByStatus: { _id: string; count: number }[];
}

interface RecentIssue {
  _id: string;
  title: string;
  status: string;
  location: {
    address?: string;
  };
  createdAt: string;
  upvotes: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentIssues, setRecentIssues] = useState<RecentIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, issuesResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/issues', { params: { limit: 5, sortBy: 'createdAt:desc' } })
      ]);

      setStats(statsResponse.data.data);
      setRecentIssues(issuesResponse.data.data.issues);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-yellow-500" />
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Failed to load dashboard data
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            We couldn't retrieve the dashboard information. Please try again.
          </p>
          <Button onClick={fetchDashboardData} variant="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Issues',
      value: stats.totalIssues.toLocaleString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Resolved Issues',
      value: stats.resolvedIssues.toLocaleString(),
      change: `${Math.round(stats.resolutionRate)}%`,
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Unresolved Issues',
      value: stats.unresolvedIssues.toLocaleString(),
      change: `${Math.round((stats.unresolvedIssues / stats.totalIssues) * 100)}%`,
      changeType: stats.unresolvedIssues > 0 ? 'increase' : 'decrease',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Avg Resolution Time',
      value: '4.2 days',
      change: '-1.2 days',
      changeType: 'decrease' as const,
      icon: Clock,
      color: 'orange'
    }
  ];

  const issuesByCategory = stats.issuesByCategory.map(category => ({
    name: category._id.charAt(0).toUpperCase() + category._id.slice(1),
    value: category.count,
    percentage: Math.round((category.count / stats.totalIssues) * 100)
  }));

  // Fixed status mapping to properly handle 'rejected' status
  const issuesByStatus = stats.issuesByStatus.map(status => ({
    name: status._id === 'resolved' ? 'Resolved' : 
          status._id === 'in-progress' ? 'In Progress' :
          status._id === 'rejected' ? 'Rejected' : 'Reported',
    value: status.count,
    color: status._id === 'resolved' ? '#10B981' : 
          status._id === 'in-progress' ? '#F59E0B' :
          status._id === 'rejected' ? '#8B5CF6' : '#EF4444'
  }));

  const monthlyData = [
    { month: 'Jan', reported: 85, resolved: 72 },
    { month: 'Feb', reported: 92, resolved: 78 },
    { month: 'Mar', reported: 108, resolved: 95 },
    { month: 'Apr', reported: 125, resolved: 112 },
    { month: 'May', reported: 140, resolved: 128 },
    { month: 'Jun', reported: 156, resolved: 145 }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                CivicLens Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Insights and analytics for community issues
              </p>
            </div>
            <div className="flex mt-4 space-x-2 sm:mt-0">
              <Button 
                variant="ghost" 
                onClick={fetchDashboardData}
                className="text-gray-600 dark:text-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {(['week', 'month', 'year'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="capitalize"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="p-6 transition-all bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {metric.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  vs last {timeRange}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          {/* Issues by Category */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Issues by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issuesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {issuesByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value} issues`,
                      `${name} (${props.payload.percentage}%)`
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issues by Status - Fixed to show rejected status properly */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Issues by Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issuesByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4B5563' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                  <YAxis 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Issues"
                  >
                    {issuesByStatus.map((status, index) => (
                      <Cell key={`cell-${index}`} fill={status.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Trends
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4B5563' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                  <YAxis 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reported" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    name="Reported"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    name="Resolved"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Issues */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Issues
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <div 
                  key={issue._id} 
                  className="p-3 transition-all rounded-lg hover:shadow-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        issue.status === 'resolved' ? 'bg-green-500' :
                        issue.status === 'in-progress' ? 'bg-yellow-500' : 
                        issue.status === 'rejected' ? 'bg-purple-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {issue.title}
                        </p>
                        <p className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          {issue.location?.address?.split(',')[0] || 'Unknown location'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {issue.upvotes?.length || 0} votes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Sections with Scrollable Content */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          {/* Top Contributors with Scroll */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Top Contributors
            </h3>
            <div className="h-[300px] overflow-y-auto scrollbar-thin">
              <div className="pr-2 space-y-4">
                {stats.topContributors.map((user, index) => (
                  <div key={user.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.name} 
                            className="object-cover w-full h-full rounded-full"
                          />
                        ) : (
                          <span>{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.points} points • {user.badges.length} badges
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Updates with Scroll */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Recent Civic Updates
            </h3>
            <div className="h-[300px] overflow-y-auto scrollbar-thin">
              <div className="pr-2 space-y-4">
                {stats.recentUpdates.map((update) => (
                  <div key={update.title} className="p-3 border border-gray-200 rounded-lg dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 rounded-full bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300">
                        {update.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">{update.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Authority Portal CTA */}
        <div className="p-8 text-center text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl">
          <h3 className="mb-4 text-2xl font-bold">
            Local Authority Portal
          </h3>
          <p className="max-w-2xl mx-auto mb-6 text-blue-100">
            Access advanced analytics, issue management tools, and citizen engagement metrics.
          </p>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-blue-600"
          >
            Request Authority Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;