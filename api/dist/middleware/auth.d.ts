import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../types';
export declare const authenticate: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthenticate: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map