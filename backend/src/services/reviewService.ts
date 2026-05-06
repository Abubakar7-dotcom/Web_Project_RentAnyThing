import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all reviews for a listing with average rating
 */
export async function getReviews(listingId: string) {
  const reviews = await prisma.review.findMany({
    where: { listingId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Submit a review for a listing
 */
export async function submitReview(
  reviewerId: string,
  listingId: string,
  rentalId: string,
  rating: number,
  comment: string
) {
  // Verify rental exists and is completed
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: {
      listing: true,
    },
  });

  if (!rental) {
    const error = new Error('Rental not found') as any;
    error.statusCode = 404;
    throw error;
  }

  if (rental.status !== 'COMPLETED') {
    const error = new Error('Can only review completed rentals') as any;
    error.statusCode = 400;
    throw error;
  }

  // Verify the reviewer is the borrower
  if (rental.borrowerId !== reviewerId) {
    const error = new Error('Only the borrower can review this rental') as any;
    error.statusCode = 403;
    throw error;
  }

  // Verify listing matches
  if (rental.listingId !== listingId) {
    const error = new Error('Listing does not match rental') as any;
    error.statusCode = 400;
    throw error;
  }

  // Check if review already exists for this rental
  const existingReview = await prisma.review.findFirst({
    where: { rentalId },
  });

  if (existingReview) {
    const error = new Error('Review already submitted for this rental') as any;
    error.statusCode = 409;
    throw error;
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    const error = new Error('Rating must be between 1 and 5') as any;
    error.statusCode = 422;
    throw error;
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      listingId,
      reviewerId,
      rentalId,
      rating,
      comment,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
}

/**
 * Get all Q&A entries for a listing
 */
export async function getQAs(listingId: string) {
  const qas = await prisma.qA.findMany({
    where: { listingId },
    include: {
      asker: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return qas;
}

/**
 * Submit a question for a listing
 */
export async function submitQuestion(
  askerId: string,
  listingId: string,
  question: string
) {
  // Verify listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    const error = new Error('Listing not found') as any;
    error.statusCode = 404;
    throw error;
  }

  // Create Q&A entry
  const qa = await prisma.qA.create({
    data: {
      listingId,
      askerId,
      question,
      answer: null,
      answeredBy: null,
    },
    include: {
      asker: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return qa;
}
