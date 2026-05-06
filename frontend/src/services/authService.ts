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
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthUser> {
  const response = await api.post<AuthResponse>('/api/auth/register', data);
  return response.data.user;
}

/**
 * Login a user
 */
export async function login(data: LoginData): Promise<AuthUser> {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data.user;
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}

/**
 * Request a password reset email
 */
export async function forgotPassword(data: ForgotPasswordData): Promise<void> {
  await api.post('/api/auth/forgot-password', data);
}

/**
 * Reset password using token
 */
export async function resetPassword(data: ResetPasswordData): Promise<void> {
  await api.post('/api/auth/reset-password', data);
}
