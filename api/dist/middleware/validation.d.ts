import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const userCreateSchema: Joi.ObjectSchema<any>;
export declare const userUpdateSchema: Joi.ObjectSchema<any>;
export declare const loginSchema: Joi.ObjectSchema<any>;
export declare const cityCreateSchema: Joi.ObjectSchema<any>;
export declare const cityUpdateSchema: Joi.ObjectSchema<any>;
export declare const priceCreateSchema: Joi.ObjectSchema<any>;
export declare const priceUpdateSchema: Joi.ObjectSchema<any>;
export declare const categoryCreateSchema: Joi.ObjectSchema<any>;
export declare const queryParamsSchema: Joi.ObjectSchema<any>;
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map