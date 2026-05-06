import { body } from 'express-validator';

export const createRentalValidator = [
  body('listingId')
    .notEmpty()
    .withMessage('Listing ID is required')
    .isString()
    .withMessage('Listing ID must be a string'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO date')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
];

export const updateRentalValidator = [
  body('status')
    .optional()
    .isIn(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, ACTIVE, COMPLETED, CANCELLED'),
];