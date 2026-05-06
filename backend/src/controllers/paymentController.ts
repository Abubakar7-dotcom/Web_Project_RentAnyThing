import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';

export const paymentController = {
  /**
   * Process payment for a rental
   */
  async pay(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { rentalId } = req.params;

      if (typeof rentalId !== 'string') {
        return res.status(400).json({ error: 'Invalid rental ID' });
      }

      const payment = await paymentService.pay(rentalId, userId);
      res.status(201).json(payment);
    } catch (error: any) {
      console.error('Error processing payment:', error);
      
      if (error.message === 'Rental not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message === 'Only the borrower can make payment for this rental') {
        return res.status(403).json({ error: error.message });
      }
      
      if (
        error.message === 'Rental must be active to make payment' ||
        error.message === 'Payment has already been made for this rental'
      ) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Get all payments for the authenticated user
   */
  async getPayments(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const payments = await paymentService.getPayments(userId);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Get a specific payment
   */
  async getPayment(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid payment ID' });
      }

      const payment = await paymentService.getPayment(id, userId);
      res.json(payment);
    } catch (error: any) {
      console.error('Error fetching payment:', error);
      
      if (error.message === 'Payment not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  },
};