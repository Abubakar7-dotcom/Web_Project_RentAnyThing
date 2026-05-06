import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRequest } from '../middlewares/validateRequest';
import { submitReviewValidator, submitQuestionValidator } from '../validators/reviewValidator';
import * as reviewController from '../controllers/reviewController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/listings/:listingId/reviews - Get all reviews for a listing
router.get('/:listingId/reviews', reviewController.getReviews);

// POST /api/listings/:listingId/reviews - Submit a review for a listing
router.post(
  '/:listingId/reviews',
  submitReviewValidator,
  validateRequest,
  reviewController.submitReview
);

// GET /api/listings/:listingId/qa - Get all Q&A entries for a listing
router.get('/:listingId/qa', reviewController.getQAs);

// POST /api/listings/:listingId/qa - Submit a question for a listing
router.post(
  '/:listingId/qa',
  submitQuestionValidator,
  validateRequest,
  reviewController.submitQuestion
);

export default router;
