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
    const checkSession = async () => {
      console.log('[AuthContext] Checking session...');
      // Check localStorage for user data
      const storedUser = localStorage.getItem('user');
      const storedRememberMe = localStorage.getItem('rememberMe');
      
      console.log('[AuthContext] Stored user:', storedUser ? 'exists' : 'none');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('[AuthContext] Setting user from localStorage:', userData);
          
          // For now, trust localStorage - cookies might not work cross-origin
          // TODO: Implement proper token-based auth for production
          setUser(userData);
          setHasRememberMe(storedRememberMe === 'true');
          
          // Optionally verify session in background (don't block UI)
          authService.verifySession().catch(() => {
            console.log('Session verification failed, but keeping user logged in from localStorage');
          });
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
        }
      }
      
      setIsLoading(false);
      console.log('[AuthContext] Session check complete');
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true);
    try {
      console.log('[AuthContext] Logging in...');
      const { user: userData, token } = await authService.login({ email, password, rememberMe });
      console.log('[AuthContext] Login successful, user data:', userData);
      
      // Store user and token in localStorage FIRST (synchronous)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('rememberMe', String(rememberMe || false));
      console.log('[AuthContext] User data and token saved to localStorage');
      
      // Then update state
      setUser(userData);
      setHasRememberMe(rememberMe || false);
    } catch (error: any) {
      console.error('[AuthContext] Login failed:', error);
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
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
    } catch (error: any) {
      // Even if logout fails, clear local state
      setUser(null);
      setHasRememberMe(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData, token } = await authService.register({ name, email, password });
      
      // Store user and token in localStorage FIRST (synchronous)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('rememberMe', 'false');
      
      // Then update state
      setUser(userData);
      setHasRememberMe(false); // Registration doesn't have remember me
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
