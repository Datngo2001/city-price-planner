import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/types';
declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map