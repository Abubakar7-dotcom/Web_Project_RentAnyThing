import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

// GET /api/payments - Get all payments for the authenticated user
router.get('/', paymentController.getPayments);

// GET /api/payments/:id - Get a specific payment
router.get('/:id', paymentController.getPayment);

// POST /api/payments/:rentalId/pay - Process payment for a rental
router.post('/:rentalId/pay', paymentController.pay);

export default router;