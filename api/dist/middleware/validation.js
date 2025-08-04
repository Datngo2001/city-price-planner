"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validate = exports.queryParamsSchema = exports.categoryCreateSchema = exports.priceUpdateSchema = exports.priceCreateSchema = exports.cityUpdateSchema = exports.cityCreateSchema = exports.loginSchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userCreateSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    firstName: joi_1.default.string().max(50).required(),
    lastName: joi_1.default.string().max(50).required(),
});
exports.userUpdateSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30),
    email: joi_1.default.string().email(),
    firstName: joi_1.default.string().max(50),
    lastName: joi_1.default.string().max(50),
    isActive: joi_1.default.boolean(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.cityCreateSchema = joi_1.default.object({
    name: joi_1.default.string().max(100).required(),
    country: joi_1.default.string().max(100).required(),
    region: joi_1.default.string().max(100),
    latitude: joi_1.default.number().min(-90).max(90).required(),
    longitude: joi_1.default.number().min(-180).max(180).required(),
    population: joi_1.default.number().min(0),
    currency: joi_1.default.string().length(3).uppercase().required(),
    timezone: joi_1.default.string().required(),
});
exports.cityUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().max(100),
    country: joi_1.default.string().max(100),
    region: joi_1.default.string().max(100),
    latitude: joi_1.default.number().min(-90).max(90),
    longitude: joi_1.default.number().min(-180).max(180),
    population: joi_1.default.number().min(0),
    currency: joi_1.default.string().length(3).uppercase(),
    timezone: joi_1.default.string(),
    isActive: joi_1.default.boolean(),
});
exports.priceCreateSchema = joi_1.default.object({
    cityId: joi_1.default.string().required(),
    categoryId: joi_1.default.string().required(),
    category: joi_1.default.string().max(100).required(),
    subcategory: joi_1.default.string().max(100),
    itemName: joi_1.default.string().max(200).required(),
    price: joi_1.default.number().min(0).required(),
    currency: joi_1.default.string().length(3).uppercase().required(),
    unit: joi_1.default.string().max(50),
    source: joi_1.default.string().max(200),
    notes: joi_1.default.string().max(500),
    dateRecorded: joi_1.default.date(),
});
exports.priceUpdateSchema = joi_1.default.object({
    categoryId: joi_1.default.string(),
    category: joi_1.default.string().max(100),
    subcategory: joi_1.default.string().max(100),
    itemName: joi_1.default.string().max(200),
    price: joi_1.default.number().min(0),
    currency: joi_1.default.string().length(3).uppercase(),
    unit: joi_1.default.string().max(50),
    source: joi_1.default.string().max(200),
    notes: joi_1.default.string().max(500),
    dateRecorded: joi_1.default.date(),
    isVerified: joi_1.default.boolean(),
});
exports.categoryCreateSchema = joi_1.default.object({
    name: joi_1.default.string().max(100).required(),
    description: joi_1.default.string().max(500),
    icon: joi_1.default.string().max(50),
    color: joi_1.default.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    parentId: joi_1.default.string(),
});
exports.queryParamsSchema = joi_1.default.object({
    page: joi_1.default.number().min(1).default(1),
    limit: joi_1.default.number().min(1).max(100).default(10),
    sortBy: joi_1.default.string(),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('asc'),
    search: joi_1.default.string(),
});
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            res.status(400).json({
                success: false,
                message: 'Validation error',
                error: errorMessages,
            });
            return;
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            res.status(400).json({
                success: false,
                message: 'Query validation error',
                error: errorMessages,
            });
            return;
        }
        req.query = value;
        next();
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validation.js.map