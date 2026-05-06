import { body } from 'express-validator';

/**
 * Validator for submitting a review
 */
export const submitReviewValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 1 })
    .withMessage('Comment cannot be empty'),
  body('rentalId')
    .notEmpty()
    .withMessage('Rental ID is required')
    .isString()
    .withMessage('Rental ID must be a string'),
];

/**
 * Validator for submitting a question
 */
export const submitQuestionValidator = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ min: 1 })
    .withMessage('Question cannot be empty'),
];
