export declare const generatePagination: (page: number, limit: number, totalItems: number) => {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};
export declare const asyncHandler: (fn: Function) => (req: any, res: any, next: any) => void;
export declare const createError: (message: string, statusCode?: number) => any;
export declare const sanitizeQuery: (query: any) => any;
export declare const getSkipAndLimit: (page: number, limit: number) => {
    skip: number;
    limit: number;
};
export declare const formatApiResponse: <T>(success: boolean, message: string, data?: T, pagination?: any, error?: string) => any;
//# sourceMappingURL=helpers.d.ts.map