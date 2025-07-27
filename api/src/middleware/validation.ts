import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { ApiResponse, ValidationError } from '@/types';

// Generic validation result handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors.array().map(error => ({
      field: (error as any).path || (error as any).param || 'unknown',
      message: error.msg,
      value: (error as any).value
    }));

    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      errors: validationErrors
    };

    res.status(400).json(response);
    return;
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and cannot exceed 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and cannot exceed 50 characters'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// City validation rules
const validateCity = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name is required and cannot exceed 100 characters'),
  
  body('country')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Country is required and cannot exceed 100 characters'),
  
  body('countryCode')
    .trim()
    .isLength({ min: 2, max: 2 })
    .isAlpha()
    .toUpperCase()
    .withMessage('Country code must be exactly 2 letters'),
  
  body('continent')
    .isIn(['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'])
    .withMessage('Invalid continent'),
  
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  body('timezone')
    .notEmpty()
    .withMessage('Timezone is required'),
  
  body('currency.code')
    .trim()
    .isLength({ min: 3, max: 3 })
    .isAlpha()
    .toUpperCase()
    .withMessage('Currency code must be exactly 3 letters'),
  
  body('currency.name')
    .trim()
    .notEmpty()
    .withMessage('Currency name is required'),
  
  body('currency.symbol')
    .trim()
    .notEmpty()
    .withMessage('Currency symbol is required'),
  
  body('language.primary')
    .trim()
    .notEmpty()
    .withMessage('Primary language is required'),
  
  handleValidationErrors
];

// Price validation rules
const validatePrice = [
  body('city')
    .isMongoId()
    .withMessage('Valid city ID is required'),
  
  body('category')
    .isIn(['housing', 'food', 'transportation', 'utilities', 'healthcare', 'education', 'entertainment', 'clothing', 'services', 'other'])
    .withMessage('Invalid category'),
  
  body('subcategory')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Subcategory is required and cannot exceed 100 characters'),
  
  body('item.name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Item name is required and cannot exceed 200 characters'),
  
  body('item.unit')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Unit is required and cannot exceed 50 characters'),
  
  body('price.amount')
    .isFloat({ min: 0 })
    .withMessage('Price amount must be a positive number'),
  
  body('price.currency')
    .trim()
    .isLength({ min: 3, max: 3 })
    .isAlpha()
    .toUpperCase()
    .withMessage('Currency must be exactly 3 letters'),
  
  body('source.type')
    .isIn(['user_reported', 'official', 'website', 'api', 'survey', 'other'])
    .withMessage('Invalid source type'),
  
  body('source.name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Source name is required and cannot exceed 100 characters'),
  
  handleValidationErrors
];

// Update validation rules (partial validation)
const validateUserUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  handleValidationErrors
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

export {
  validateUserRegistration,
  validateUserLogin,
  validateCity,
  validatePrice,
  validateUserUpdate,
  validatePasswordChange,
  handleValidationErrors
};
