import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailUtils';

const prisma = new PrismaClient();

/**
 * Register a new user
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password (will be hashed)
 * @returns Created user object (without password)
 * @throws Error if email already exists
 */
export async function register(name: string, email: string, password: string) {
  // Check for duplicate email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Email already registered') as any;
    error.statusCode = 409;
    throw error;
  }

  // Hash password with bcrypt cost factor 10
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with role USER
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Login a user
 * @param email - User's email address
 * @param password - User's password
 * @returns User object (without password)
 * @throws Error if credentials are invalid or account is deactivated
 */
export async function login(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('Invalid email or password') as any;
    error.statusCode = 401;
    throw error;
  }

  // Check if account is active
  if (!user.isActive) {
    const error = new Error('Account deactivated') as any;
    error.statusCode = 403;
    throw error;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password') as any;
    error.statusCode = 401;
    throw error;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Logout a user (no-op, cookie cleared by controller)
 */
export function logout() {
  // No-op - cookie is cleared by the controller
  return;
}

/**
 * Initiate password reset process
 * @param email - User's email address
 */
export async function forgotPassword(email: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return;
  }

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token before storing
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set token expiry to 1 hour from now
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  // Store hashed token and expiry
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpiry: tokenExpiry,
    },
  });

  // Send email with reset URL (token is unhashed in URL)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(email, resetUrl);
}

/**
 * Reset user password using token
 * @param token - Password reset token (unhashed)
 * @param newPassword - New password
 * @throws Error if token is invalid or expired
 */
export async function resetPassword(token: string, newPassword: string) {
  // Hash the provided token to match stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with matching token and non-expired token
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpiry: {
        gt: new Date(), // Token expiry must be greater than now
      },
    },
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token') as any;
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear reset token fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });
}
