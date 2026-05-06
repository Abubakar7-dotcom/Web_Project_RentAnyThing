import { Router } from 'express';
import { rentalController } from '../controllers/rentalController';
import { authenticate } from '../middlewares/authenticate';
import { validateRequest } from '../middlewares/validateRequest';
import { createRentalValidator } from '../validators/rentalValidator';

const router = Router();

// All rental routes require authentication
router.use(authenticate);

// GET /api/rentals - Get all rentals for the authenticated user
router.get('/', rentalController.getRentals);

// POST /api/rentals - Create a new rental
router.post('/', createRentalValidator, validateRequest, rentalController.createRental);

// GET /api/rentals/:id - Get a specific rental
router.get('/:id', rentalController.getRental);

// POST /api/rentals/:id/approve - Approve a rental (owner only)
router.post('/:id/approve', rentalController.approveRental);

// POST /api/rentals/:id/complete - Complete a rental (owner only)
router.post('/:id/complete', rentalController.completeRental);

// POST /api/rentals/:id/cancel - Cancel a rental (borrower or owner)
router.post('/:id/cancel', rentalController.cancelRental);

export default router;