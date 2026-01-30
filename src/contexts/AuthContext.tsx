import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiBase } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fetch with timeout to prevent infinite hangs (e.g. cold starts, unreachable server)
const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = getApiBase();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (data: { message?: string; errors?: Array<{ msg: string }> }) => {
    if (data.message) return data.message;
    if (data.errors?.length) return data.errors.map((e) => e.msg).join('. ');
    return 'Request failed';
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(data) || 'Login failed');
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
        throw err;
      }
      throw new Error('Network error. Is the server running?');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(data) || 'Registration failed');
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
        throw err;
      }
      throw new Error('Network error. Is the server running?');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};