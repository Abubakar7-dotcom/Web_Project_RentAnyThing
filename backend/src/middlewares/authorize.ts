import { Request, Response, NextFunction } from 'express';

/**
 * Middleware factory to authorize requests based on user role
 * Must be used after authenticate middleware
 * @param roles - Array of allowed roles
 * @returns Express middleware function
 */
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}
