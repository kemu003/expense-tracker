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
    if (token) {
      apiClient.setToken(token);
      // Try to fetch user info from a profile endpoint
      // For now, we'll just set a basic user object based on stored email
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      if (email) {
        setUser({
          id: parseInt(localStorage.getItem('user_id') || '0'),
          email,
          first_name: name || '',
        });
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await apiClient.register(email, password, name);
      // After registration, log them in
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.access);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);
      localStorage.setItem('refresh_token', response.refresh);
      
      setUser({
        id: 0,
        email,
        first_name: name,
      });
      
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.access);
      localStorage.setItem('user_email', email);
      localStorage.setItem('refresh_token', response.refresh);
      
      setUser({
        id: 0,
        email,
        first_name: email.split('@')[0],
      });
      
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const signOut = async () => {
    apiClient.setToken(null);
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
