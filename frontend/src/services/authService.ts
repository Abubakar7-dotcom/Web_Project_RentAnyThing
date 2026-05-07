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
  token: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return { user: response.data.user, token: response.data.token };
}

/**
 * Login a user
 */
export async function login(data: LoginData): Promise<{ user: AuthUser; token: string }> {
  const response = await api.post<AuthResponse>('/auth/login', data);
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

/**
 * Verify if the current session is still valid
 */
export async function verifySession(): Promise<void> {
  // Make a simple API call to check if the session cookie is valid
  await api.get('/auth/socket-token');
}
