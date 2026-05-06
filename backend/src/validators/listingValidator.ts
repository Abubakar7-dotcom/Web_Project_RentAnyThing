import { body } from 'express-validator';

/**
 * Validator for creating a new listing
 */
export const createListingValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .custom((value) => {
      if (!value || value.trim().length === 0) {
        throw new Error('Description cannot be empty or whitespace only');
      }
      return true;
    }),
  
  body('pricePerDay')
    .isFloat({ gt: 0 })
    .withMessage('Price per day must be a positive number greater than 0'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('depositAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Deposit amount must be a non-negative number'),
];

/**
 * Validator for updating an existing listing
 * All fields are optional for updates
 */
export const updateListingValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .custom((value) => {
      if (value !== undefined && (!value || value.trim().length === 0)) {
        throw new Error('Description cannot be empty or whitespace only');
      }
      return true;
    }),
  
  body('pricePerDay')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price per day must be a positive number greater than 0'),
  
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  
  body('depositAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Deposit amount must be a non-negative number'),
];