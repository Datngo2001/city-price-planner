"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validatePasswordChange = exports.validateUserUpdate = exports.validatePrice = exports.validateCity = exports.validateUserLogin = exports.validateUserRegistration = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const validationErrors = errors.array().map(error => ({
            field: error.path || error.param || 'unknown',
            message: error.msg,
            value: error.value
        }));
        const response = {
            success: false,
            message: 'Validation failed',
            errors: validationErrors
        };
        res.status(400).json(response);
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const validateUserRegistration = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    (0, express_validator_1.body)('firstName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name is required and cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name is required and cannot exceed 50 characters'),
    handleValidationErrors
];
exports.validateUserRegistration = validateUserRegistration;
const validateUserLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];
exports.validateUserLogin = validateUserLogin;
const validateCity = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('City name is required and cannot exceed 100 characters'),
    (0, express_validator_1.body)('country')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Country is required and cannot exceed 100 characters'),
    (0, express_validator_1.body)('countryCode')
        .trim()
        .isLength({ min: 2, max: 2 })
        .isAlpha()
        .toUpperCase()
        .withMessage('Country code must be exactly 2 letters'),
    (0, express_validator_1.body)('continent')
        .isIn(['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'])
        .withMessage('Invalid continent'),
    (0, express_validator_1.body)('coordinates.latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),
    (0, express_validator_1.body)('coordinates.longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),
    (0, express_validator_1.body)('timezone')
        .notEmpty()
        .withMessage('Timezone is required'),
    (0, express_validator_1.body)('currency.code')
        .trim()
        .isLength({ min: 3, max: 3 })
        .isAlpha()
        .toUpperCase()
        .withMessage('Currency code must be exactly 3 letters'),
    (0, express_validator_1.body)('currency.name')
        .trim()
        .notEmpty()
        .withMessage('Currency name is required'),
    (0, express_validator_1.body)('currency.symbol')
        .trim()
        .notEmpty()
        .withMessage('Currency symbol is required'),
    (0, express_validator_1.body)('language.primary')
        .trim()
        .notEmpty()
        .withMessage('Primary language is required'),
    handleValidationErrors
];
exports.validateCity = validateCity;
const validatePrice = [
    (0, express_validator_1.body)('city')
        .isMongoId()
        .withMessage('Valid city ID is required'),
    (0, express_validator_1.body)('category')
        .isIn(['housing', 'food', 'transportation', 'utilities', 'healthcare', 'education', 'entertainment', 'clothing', 'services', 'other'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('subcategory')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Subcategory is required and cannot exceed 100 characters'),
    (0, express_validator_1.body)('item.name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Item name is required and cannot exceed 200 characters'),
    (0, express_validator_1.body)('item.unit')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Unit is required and cannot exceed 50 characters'),
    (0, express_validator_1.body)('price.amount')
        .isFloat({ min: 0 })
        .withMessage('Price amount must be a positive number'),
    (0, express_validator_1.body)('price.currency')
        .trim()
        .isLength({ min: 3, max: 3 })
        .isAlpha()
        .toUpperCase()
        .withMessage('Currency must be exactly 3 letters'),
    (0, express_validator_1.body)('source.type')
        .isIn(['user_reported', 'official', 'website', 'api', 'survey', 'other'])
        .withMessage('Invalid source type'),
    (0, express_validator_1.body)('source.name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Source name is required and cannot exceed 100 characters'),
    handleValidationErrors
];
exports.validatePrice = validatePrice;
const validateUserUpdate = [
    (0, express_validator_1.body)('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    handleValidationErrors
];
exports.validateUserUpdate = validateUserUpdate;
const validatePasswordChange = [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    handleValidationErrors
];
exports.validatePasswordChange = validatePasswordChange;
//# sourceMappingURL=validation.js.map