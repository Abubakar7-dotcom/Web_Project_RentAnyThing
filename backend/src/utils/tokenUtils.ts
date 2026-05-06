import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';
const JWT_REMEMBER_EXPIRES_IN = process.env.JWT_REMEMBER_EXPIRES_IN || '30d';

export interface TokenPayload {
  id: string;
  role: string;
}

/**
 * Signs a JWT token with user ID and role
 * @param userId - The user's unique identifier
 * @param role - The user's role (USER or ADMIN)
 * @param rememberMe - Whether to use extended expiration (30 days vs 30 minutes)
 * @returns Signed JWT token string
 */
export function signToken(userId: string, role: string, rememberMe: boolean = false): string {
  const payload: TokenPayload = {
    id: userId,
    role,
  };

  const expiresIn = rememberMe ? JWT_REMEMBER_EXPIRES_IN : JWT_EXPIRES_IN;

  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
}

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token - The JWT token string to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}
