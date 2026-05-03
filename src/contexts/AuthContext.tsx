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
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');
    const id = localStorage.getItem('user_id');

    if (token && email) {
      setUser({
        id: parseInt(id || '0'),
        email,
        first_name: name || '',
      });
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('🔐 Starting registration process...');
      await apiClient.register(email, password, name);
      console.log('✅ Registration successful, logging in...');
      
      // After registration, log them in
      const response = await apiClient.login(email, password);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_id', '1');

      setUser({
        id: 1,
        email,
        first_name: name,
      });

      console.log('✅ Login successful, user set');
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
      console.log('🔐 Starting login process...');
      const response = await apiClient.login(email, password);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', email.split('@')[0]);
      localStorage.setItem('user_id', '1');

      setUser({
        id: 1,
        email,
        first_name: email.split('@')[0],
      });

      console.log('✅ Login successful');
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
        status: error?.response?.status 
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
