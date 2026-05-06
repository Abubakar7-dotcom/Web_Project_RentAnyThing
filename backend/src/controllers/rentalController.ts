import { Request, Response } from 'express';
import { rentalService } from '../services/rentalService';

export const rentalController = {
  /**
   * Get all rentals for the authenticated user
   */
  async getRentals(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const rentals = await rentalService.getRentals(userId);
      res.json(rentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Create a new rental
   */
  async createRental(req: Request, res: Response) {
    try {
      const borrowerId = req.user!.id;
      const { listingId, startDate, endDate } = req.body;

      const rental = await rentalService.createRental(
        borrowerId,
        listingId,
        startDate,
        endDate
      );

      res.status(201).json(rental);
    } catch (error: any) {
      console.error('Error creating rental:', error);
      
      if (error.message === 'Listing not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (
        error.message === 'Listing is not available for rent' ||
        error.message === 'You cannot rent your own listing'
      ) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Get a specific rental
   */
  async getRental(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid rental ID' });
      }

      const rental = await rentalService.getRental(id, userId);
      res.json(rental);
    } catch (error: any) {
      console.error('Error fetching rental:', error);
      
      if (error.message === 'Rental not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Approve a rental (owner only)
   */
  async approveRental(req: Request, res: Response) {
    try {
      const ownerId = req.user!.id;
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid rental ID' });
      }

      const rental = await rentalService.approveRental(id, ownerId);
      res.json(rental);
    } catch (error: any) {
      console.error('Error approving rental:', error);
      
      if (error.message === 'Rental not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (
        error.message === 'Only the listing owner can approve rentals' ||
        error.message === 'Only pending rentals can be approved'
      ) {
        return res.status(403).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Complete a rental (owner only)
   */
  async completeRental(req: Request, res: Response) {
    try {
      const ownerId = req.user!.id;
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid rental ID' });
      }

      const rental = await rentalService.completeRental(id, ownerId);
      res.json(rental);
    } catch (error: any) {
      console.error('Error completing rental:', error);
      
      if (error.message === 'Rental not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (
        error.message === 'Only the listing owner can complete rentals' ||
        error.message === 'Only active rentals can be completed'
      ) {
        return res.status(403).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Cancel a rental (borrower or owner)
   */
  async cancelRental(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid rental ID' });
      }

      const rental = await rentalService.cancelRental(id, userId);
      res.json(rental);
    } catch (error: any) {
      console.error('Error cancelling rental:', error);
      
      if (error.message === 'Rental not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (
        error.message === 'Only the borrower or listing owner can cancel rentals' ||
        error.message === 'Only pending rentals can be cancelled'
      ) {
        return res.status(403).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  },
};