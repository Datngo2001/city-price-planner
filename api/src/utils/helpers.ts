export const generatePagination = (
  page: number,
  limit: number,
  totalItems: number
) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const createError = (message: string, statusCode: number = 500) => {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  return error;
};

export const sanitizeQuery = (query: any) => {
  const sanitized: any = {};
  
  for (const key in query) {
    if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
      sanitized[key] = query[key];
    }
  }
  
  return sanitized;
};

export const getSkipAndLimit = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

export const formatApiResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  pagination?: any,
  error?: string
) => {
  const response: any = {
    success,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  if (error) {
    response.error = error;
  }

  return response;
};
