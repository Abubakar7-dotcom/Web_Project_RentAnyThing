import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../services/authService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  hasRememberMe: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRememberMe, setHasRememberMe] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      // Check localStorage for user data
      const storedUser = localStorage.getItem('user');
      const storedRememberMe = localStorage.getItem('rememberMe');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setHasRememberMe(storedRememberMe === 'true');
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
        }
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true);
    try {
      const userData = await authService.login({ email, password, rememberMe });
      setUser(userData);
      setHasRememberMe(rememberMe || false);
      
      // Store user in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('rememberMe', String(rememberMe || false));
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setHasRememberMe(false);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    } catch (error: any) {
      // Even if logout fails, clear local state
      setUser(null);
      setHasRememberMe(false);
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.register({ name, email, password });
      setUser(userData);
      setHasRememberMe(false); // Registration doesn't have remember me
      
      // Store user in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('rememberMe', 'false');
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, hasRememberMe, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
