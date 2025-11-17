// src/services/issues.ts
import api from './api';
import { Issue, CreateIssueInput, IssuesResponse, Comment} from '../types';

export const createIssue = async (data: CreateIssueInput, files: File[]): Promise<Issue> => {
  const formData = new FormData();
  
  // Append all fields except images
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'images') {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  });
  
  // Append all image files
  files.forEach(file => {
    formData.append('images', file);
  });

  try {
    const response = await api.post('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Ensure the response contains the expected data
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data.data as Issue;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to submit issue';
    throw new Error(errorMessage);
  }
};

export const getIssues = async (params?: {
  category?: string;
  status?: string;
  severity?: string;
  state?: string;
  district?: string;
  pincode?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
}): Promise<{ issues: Issue[]; count: number }> => {
  try {
    const response = await api.get('/issues', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw new Error('Failed to fetch issues');
  }
};

export const upvoteIssue = async (issueId: string): Promise<Issue> => {
  try {
    const response = await api.post(`/issues/${issueId}/upvote`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error upvoting issue:', error);
    throw new Error(error.response?.data?.message || 'Failed to upvote issue');
  }
};

export const addComment = async (issueId: string, comment: { text: string }): Promise<Issue> => {
  try {
    const response = await api.post(`/issues/${issueId}/comments`, comment);
    return response.data.data;
  } catch (error: any) {
    console.error('Error adding comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to add comment');
  }
};
export const deleteComment = async (issueId: string, commentId: string): Promise<Issue> => {
  try {
    const response = await api.delete(`/issues/${issueId}/comments/${commentId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete comment');
  }
};

export const getIssueById = async (id: string): Promise<Issue> => {
  try {
    const response = await api.get(`/issues/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch issue details');
  }
};
