import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { signToken } from '../utils/tokenUtils';

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    // Call auth service to register user
    const user = await authService.register(name, email, password);

    // Sign JWT token (default 30 minutes)
    const token = signToken(user.id, user.role, false);

    // Set HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
    });

    // Return user without password
    res.status(201).json({ user });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Login a user
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, rememberMe } = req.body;

    // Call auth service to login user
    const user = await authService.login(email, password);

    // Sign JWT token with rememberMe flag
    const token = signToken(user.id, user.role, rememberMe || false);

    // Calculate cookie max age based on rememberMe
    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
      : 30 * 60 * 1000; // 30 minutes in milliseconds

    // Set HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    // Return user without password
    res.status(200).json({ user });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Logout a user
 */
export async function logout(req: Request, res: Response): Promise<void> {
  try {
    // Call auth service (no-op)
    authService.logout();

    // Clear JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Initiate forgot password process
 */
export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    // Call auth service
    await authService.forgotPassword(email);

    // Always return success to prevent email enumeration
    res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Reset password using token
 */
export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { token, password } = req.body;

    // Call auth service
    await authService.resetPassword(token, password);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}
