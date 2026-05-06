import { body } from 'express-validator';

/**
 * Validator for submitting a complaint
 */
export const submitComplaintValidator = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body()
    .custom((value) => {
      // At least one of reportedUserId or listingId must be present
      if (!value.reportedUserId && !value.listingId) {
        throw new Error('Either reportedUserId or listingId must be provided');
      }
      return true;
    }),
  body('reportedUserId')
    .optional()
    .isString()
    .withMessage('Reported user ID must be a string'),
  body('listingId')
    .optional()
    .isString()
    .withMessage('Listing ID must be a string'),
];
