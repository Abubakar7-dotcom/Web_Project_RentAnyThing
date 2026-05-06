import api from './api';

export interface Review {
  id: string;
  listingId: string;
  reviewerId: string;
  rentalId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
  };
}

export interface QA {
  id: string;
  listingId: string;
  askerId: string;
  question: string;
  answer: string | null;
  answeredBy: string | null;
  createdAt: string;
  asker: {
    id: string;
    name: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
}

/**
 * Get all reviews for a listing
 */
export async function getReviews(listingId: string): Promise<ReviewsResponse> {
  const response = await api.get(`/listings/${listingId}/reviews`);
  return response.data;
}

/**
 * Submit a review for a listing
 */
export async function submitReview(
  listingId: string,
  data: {
    rating: number;
    comment: string;
    rentalId: string;
  }
): Promise<Review> {
  const response = await api.post(`/listings/${listingId}/reviews`, data);
  return response.data;
}

/**
 * Get all Q&A entries for a listing
 */
export async function getQAs(listingId: string): Promise<QA[]> {
  const response = await api.get(`/listings/${listingId}/qa`);
  return response.data;
}

/**
 * Submit a question for a listing
 */
export async function submitQuestion(
  listingId: string,
  question: string
): Promise<QA> {
  const response = await api.post(`/listings/${listingId}/qa`, { question });
  return response.data;
}
