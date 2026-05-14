import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient from '../lib/api';

interface User {
  id: number;
  email: string;
  first_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  demoLogin: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');
    const id = localStorage.getItem('user_id');
    const demoFlag = localStorage.getItem('is_demo') === 'true';

    if (token && email) {
      setUser({
        id: parseInt(id || '0'),
        email,
        first_name: name || '',
      });
      setIsDemo(demoFlag);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('🔐 Starting registration process with:', { email: email.trim(), name });
      await apiClient.register(email, password, name);
      console.log('✅ Registration successful, now logging in...');
      
      // After registration, log them in
      const response = await apiClient.login(email, password);
      console.log('✅ Login response received after registration');
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user_email', email.toLowerCase());
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_id', '1');
      localStorage.setItem('is_demo', 'false');

      const userData = {
        id: 1,
        email: email.toLowerCase(),
        first_name: name,
      };

      console.log('✅ Setting user state after registration:', userData);
      setUser(userData);

      console.log('✅ Registration and login successful');
      return { error: null };
    } catch (error: any) {
      // Extract error message from axios error response
      const message = error?.response?.data?.error || 
                     error?.response?.data?.detail ||
                     error?.message || 
                     'Registration failed';
      console.error('❌ Registration/Login Error:', { 
        error, 
        message, 
        responseData: error?.response?.data,
        status: error?.response?.status 
      });
      return { error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting login process with:', { email: email.trim() });
      const response = await apiClient.login(email, password);
      console.log('✅ Login API response received:', { 
        hasAccess: !!response.access, 
        hasRefresh: !!response.refresh 
      });
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user_email', email.toLowerCase());
      localStorage.setItem('user_name', email.split('@')[0]);
      localStorage.setItem('user_id', '1');
      localStorage.setItem('is_demo', 'false');

      const userData = {
        id: 1,
        email: email.toLowerCase(),
        first_name: email.split('@')[0],
      };

      console.log('✅ Setting user state:', userData);
      setUser(userData);

      console.log('✅ Login successful - user state updated');
      return { error: null };
    } catch (error: any) {
      const message = error?.response?.data?.error || 
                     error?.response?.data?.detail ||
                     error?.message || 
                     'Login failed';
      console.error('❌ Login Error:', { 
        error, 
        message, 
        responseData: error?.response?.data,
        status: error?.response?.status,
        errorKeys: error?.response?.data ? Object.keys(error.response.data) : 'no data'
      });
      return { error: message };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_demo');
    setUser(null);
    setIsDemo(false);
  };

  const demoLogin = async () => {
    try {
      console.log('🎮 Starting demo login...');
      const response = await apiClient.demoLogin();
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user_email', 'demo@example.com');
      localStorage.setItem('user_name', 'Demo User');
      localStorage.setItem('user_id', response.user?.id?.toString() || '0');
      localStorage.setItem('is_demo', 'true');

      setUser({
        id: response.user?.id || 0,
        email: 'demo@example.com',
        first_name: 'Demo User',
      });
      setIsDemo(true);

      console.log('✅ Demo login successful');
      return { error: null };
    } catch (error: any) {
      const message = error?.response?.data?.error || 
                     error?.response?.data?.detail ||
                     error?.message || 
                     'Demo login failed';
      console.error('❌ Demo Login Error:', message);
      return { error: message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signUp, signIn, demoLogin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
