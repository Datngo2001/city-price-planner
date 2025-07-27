import { Request, Response, NextFunction } from 'express';
import { PaginationMeta } from '@/types';
declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
declare const generateRandomString: (length?: number) => string;
declare const formatResponse: (success: boolean, message: string, data?: any, meta?: any) => any;
declare const calculatePagination: (page: number, limit: number, total: number) => PaginationMeta;
declare const isValidObjectId: (id: string) => boolean;
declare const removeUndefined: (obj: any) => any;
declare const toProperCase: (str: string) => string;
declare const generateSlug: (str: string) => string;
declare const isValidEmail: (email: string) => boolean;
declare const calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
export { asyncHandler, generateRandomString, formatResponse, calculatePagination, isValidObjectId, removeUndefined, toProperCase, generateSlug, isValidEmail, calculateDistance };
//# sourceMappingURL=helpers.d.ts.map