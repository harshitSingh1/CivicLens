import { Issue, User, DashboardMetrics } from '../types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing damage to vehicles near the intersection of Main St and Oak Ave.',
    category: 'pothole',
    status: 'open',
    severity: 'urgent',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY 10001'
    },
    images: ['https://images.pexels.com/photos/7428165/pexels-photo-7428165.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'Sarah Johnson',
    reportedAt: '2025-01-08T10:30:00Z',
    votes: 15
  },
  {
    id: '2',
    title: 'Broken street light',
    description: 'Street light has been out for over a week, creating safety hazard for pedestrians.',
    category: 'lighting',
    status: 'in_progress',
    severity: 'medium',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '456 Broadway, New York, NY 10013'
    },
    images: ['https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'Mike Chen',
    reportedAt: '2025-01-07T14:15:00Z',
    votes: 8
  },
  {
    id: '3',
    title: 'Overflowing garbage bins',
    description: 'Multiple garbage bins overflowing in the park area, attracting pests.',
    category: 'garbage',
    status: 'resolved',
    severity: 'low',
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: '789 Park Ave, New York, NY 10021'
    },
    images: ['https://images.pexels.com/photos/3196766/pexels-photo-3196766.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'Anna Rodriguez',
    reportedAt: '2025-01-06T09:45:00Z',
    resolvedAt: '2025-01-08T16:20:00Z',
    votes: 12
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    points: 250,
    level: 3,
    badges: ['First Report', 'Community Hero', 'Photo Pro'],
    reportsCount: 12,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    points: 180,
    level: 2,
    badges: ['First Report', 'Night Owl'],
    reportsCount: 8,
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
  },
  {
    id: '3',
    name: 'Anna Rodriguez',
    email: 'anna@example.com',
    points: 320,
    level: 4,
    badges: ['First Report', 'Community Hero', 'Resolver', 'Top Contributor'],
    reportsCount: 15,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
  }
];

export const mockMetrics: DashboardMetrics = {
  totalIssues: 1247,
  resolvedIssues: 892,
  avgResolutionTime: 4.2,
  activeUsers: 156
};

export const testimonials = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    role: 'Local Resident',
    content: 'CivicLens helped me report a dangerous pothole that was fixed within days. The city actually listens now!',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
  },
  {
    id: 2,
    name: 'David Park',
    role: 'Community Leader',
    content: 'The gamification aspect makes civic engagement fun. Our neighborhood participation has increased by 300%.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
  },
  {
    id: 3,
    name: 'Lisa Thompson',
    role: 'City Council Member',
    content: 'CivicLens provides invaluable data that helps us prioritize and allocate resources more effectively.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
  }
];