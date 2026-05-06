import { Router } from 'express';
import * as authController from '../controllers/authController';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/authValidator';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

// POST /api/auth/register - Register a new user
router.post(
  '/register',
  registerValidator,
  validateRequest,
  authController.register
);

// POST /api/auth/login - Login a user
router.post(
  '/login',
  loginValidator,
  validateRequest,
  authController.login
);

// POST /api/auth/logout - Logout a user (requires authentication)
router.post(
  '/logout',
  authenticate,
  authController.logout
);

// POST /api/auth/forgot-password - Initiate password reset
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  authController.forgotPassword
);

// POST /api/auth/reset-password - Reset password with token
router.post(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  authController.resetPassword
);

// GET /api/auth/socket-token - Get socket token for Socket.io auth
router.get('/socket-token', authenticate, authController.getSocketToken);

export default router;
