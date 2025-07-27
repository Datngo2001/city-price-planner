import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, OptionalAuthRequest } from '@/types';
declare const auth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
declare const authorize: (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
declare const optionalAuth: (req: OptionalAuthRequest, res: Response, next: NextFunction) => Promise<void>;
export { auth, authorize, optionalAuth };
//# sourceMappingURL=auth.d.ts.map