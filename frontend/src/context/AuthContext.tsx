import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, Student, Faculty } from '@/utils/types';
import api from '@/api/axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  getStudentProfile: () => Student | undefined;
  getFacultyProfile: () => Faculty | undefined;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  roll_number?: string;
  department_id?: number;
  semester?: number;
  section?: string;
  admission_year?: number;
  employee_id?: string;
  designation?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false; // Error handled by the page component
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      await api.post('/auth/register', data);
      return true;
    } catch (err) {
      console.error('Register failed', err);
      throw err; // Re-throw to be handled by the page to show exact error
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }, []);

  const getStudentProfile = useCallback(() => {
    if (!user || user.role !== 'student') return undefined;
    return user.student_profile;
  }, [user]);

  const getFacultyProfile = useCallback(() => {
    if (!user || user.role !== 'faculty') return undefined;
    return user.faculty_profile;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, getStudentProfile, getFacultyProfile, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
