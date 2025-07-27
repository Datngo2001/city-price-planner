import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
declare const validateUserRegistration: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
declare const validateUserLogin: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
declare const validateCity: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
declare const validatePrice: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
declare const validateUserUpdate: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
declare const validatePasswordChange: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
export { validateUserRegistration, validateUserLogin, validateCity, validatePrice, validateUserUpdate, validatePasswordChange, handleValidationErrors };
//# sourceMappingURL=validation.d.ts.map