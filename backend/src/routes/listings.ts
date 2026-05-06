import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRequest } from '../middlewares/validateRequest';
import { createListingValidator, updateListingValidator } from '../validators/listingValidator';
import * as listingController from '../controllers/listingController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/listings - Get all listings with optional filters
router.get('/', listingController.getListings);

// POST /api/listings - Create a new listing
router.post('/', createListingValidator, validateRequest, listingController.createListing);

// GET /api/listings/:id - Get a single listing
router.get('/:id', listingController.getListing);

// PUT /api/listings/:id - Update a listing
router.put('/:id', updateListingValidator, validateRequest, listingController.updateListing);

// DELETE /api/listings/:id - Delete a listing
router.delete('/:id', listingController.deleteListing);

export default router;