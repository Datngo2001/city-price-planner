import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

// User validation schemas
export const userCreateSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
});

export const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  isActive: Joi.boolean(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// City validation schemas
export const cityCreateSchema = Joi.object({
  name: Joi.string().max(100).required(),
  country: Joi.string().max(100).required(),
  region: Joi.string().max(100),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  population: Joi.number().min(0),
  currency: Joi.string().length(3).uppercase().required(),
  timezone: Joi.string().required(),
});

export const cityUpdateSchema = Joi.object({
  name: Joi.string().max(100),
  country: Joi.string().max(100),
  region: Joi.string().max(100),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  population: Joi.number().min(0),
  currency: Joi.string().length(3).uppercase(),
  timezone: Joi.string(),
  isActive: Joi.boolean(),
});

// Price validation schemas
export const priceCreateSchema = Joi.object({
  cityId: Joi.string().required(),
  categoryId: Joi.string().required(),
  category: Joi.string().max(100).required(),
  subcategory: Joi.string().max(100),
  itemName: Joi.string().max(200).required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().length(3).uppercase().required(),
  unit: Joi.string().max(50),
  source: Joi.string().max(200),
  notes: Joi.string().max(500),
  dateRecorded: Joi.date(),
});

export const priceUpdateSchema = Joi.object({
  categoryId: Joi.string(),
  category: Joi.string().max(100),
  subcategory: Joi.string().max(100),
  itemName: Joi.string().max(200),
  price: Joi.number().min(0),
  currency: Joi.string().length(3).uppercase(),
  unit: Joi.string().max(50),
  source: Joi.string().max(200),
  notes: Joi.string().max(500),
  dateRecorded: Joi.date(),
  isVerified: Joi.boolean(),
});

// Category validation schemas
export const categoryCreateSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(500),
  icon: Joi.string().max(50),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  parentId: Joi.string(),
});

// Query parameters validation
export const queryParamsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  sortBy: Joi.string(),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  search: Joi.string(),
});

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

// Query validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
