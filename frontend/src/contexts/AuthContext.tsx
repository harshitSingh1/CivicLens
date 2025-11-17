// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  badges: string[];
  level: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: { name?: string; email?: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (token) {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.data?.token) {
        localStorage.setItem('token', res.data.data.token);
        setToken(res.data.data.token);
        setUser(res.data.data.user);
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.data.token);
    setToken(res.data.data.token);
    setUser(res.data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const updateUser = async (data: { name?: string; email?: string }) => {
    try {
      const res = await api.patch('/users/me', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(res.data.data);
    } catch (err) {
      console.error('Failed to update user', err);
      throw err;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.patch('/users/me/password', { currentPassword, newPassword }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Failed to update password', err);
      throw err;
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    updatePassword,
    isAuthenticated: !!token,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};