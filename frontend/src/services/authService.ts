import api from './api';
import type { AuthUser } from '../context/AuthContext';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

interface AuthResponse {
  user: AuthUser;
  token?: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<{ user: AuthUser; token?: string }> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return { user: response.data.user, token: response.data.token };
}

/**
 * Login a user
 */
export async function login(data: LoginData): Promise<{ user: AuthUser; token?: string }> {
  console.log('authService.login called with:', { email: data.email, rememberMe: data.rememberMe });
  const response = await api.post<AuthResponse>('/auth/login', data);
  console.log('authService.login response:', response.data);
  
  if (!response.data.user) {
    console.error('No user in response:', response.data);
    throw new Error('Invalid response from server');
  }
  
  return { user: response.data.user, token: response.data.token };
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

/**
 * Request a password reset email
 */
export async function forgotPassword(data: ForgotPasswordData): Promise<void> {
  await api.post('/auth/forgot-password', data);
}

/**
 * Reset password using token
 */
export async function resetPassword(data: ResetPasswordData): Promise<void> {
  await api.post('/auth/reset-password', data);
}
