import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRequest } from '../middlewares/validateRequest';
import { submitComplaintValidator } from '../validators/complaintValidator';
import * as complaintController from '../controllers/complaintController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/complaints - Get complaints submitted by the authenticated user
router.get('/', complaintController.getComplaints);

// POST /api/complaints - Submit a complaint
router.post(
  '/',
  submitComplaintValidator,
  validateRequest,
  complaintController.submitComplaint
);

export default router;
