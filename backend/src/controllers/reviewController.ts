import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';

/**
 * Get all reviews for a listing
 */
export async function getReviews(req: Request, res: Response): Promise<void> {
  try {
    const listingId = req.params.listingId as string;

    const result = await reviewService.getReviews(listingId);

    res.status(200).json(result);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Submit a review for a listing
 */
export async function submitReview(req: Request, res: Response): Promise<void> {
  try {
    const listingId = req.params.listingId as string;
    const { rating, comment, rentalId } = req.body;
    const reviewerId = req.user!.id;

    const review = await reviewService.submitReview(
      reviewerId,
      listingId,
      rentalId,
      rating,
      comment
    );

    res.status(201).json(review);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Get all Q&A entries for a listing
 */
export async function getQAs(req: Request, res: Response): Promise<void> {
  try {
    const listingId = req.params.listingId as string;

    const qas = await reviewService.getQAs(listingId);

    res.status(200).json(qas);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Submit a question for a listing
 */
export async function submitQuestion(req: Request, res: Response): Promise<void> {
  try {
    const listingId = req.params.listingId as string;
    const { question } = req.body;
    const askerId = req.user!.id;

    const qa = await reviewService.submitQuestion(askerId, listingId, question);

    res.status(201).json(qa);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}
