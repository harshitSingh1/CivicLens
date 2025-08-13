// src/services/api.ts
import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const baseURL = isDevelopment 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseURL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Rest of your interceptors remain the same...
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;