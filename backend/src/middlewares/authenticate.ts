import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/tokenUtils';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT from HTTP-only cookie or Authorization header
 * Attaches user payload to req.user if valid
 * Returns 401 if token is missing or invalid
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    // Read JWT from cookie or Authorization header
    let token = req.cookies.jwt;
    
    // If no cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify token and extract payload
    const payload = verifyToken(token);

    // Attach user to request
    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication required' });
  }
}
