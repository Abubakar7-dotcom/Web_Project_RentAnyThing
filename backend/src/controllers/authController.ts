import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { signToken, verifyToken } from '../utils/tokenUtils';

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    const token = signToken(user.id, user.role, false);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 60 * 1000,
    });
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
    const user = await authService.login(email, password);
    const token = signToken(user.id, user.role, rememberMe || false);
    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 30 * 60 * 1000;
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge,
    });
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
    authService.logout();
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
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
    await authService.forgotPassword(email);
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
    await authService.resetPassword(token, password);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Get a socket token for Socket.io authentication.
 * Reads the JWT from the HTTP-only cookie (server-side) and returns it as JSON
 * so the frontend can pass it to Socket.io handshake auth.
 */
export async function getSocketToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    verifyToken(token); // ensure it's still valid
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Authentication required' });
  }
}
