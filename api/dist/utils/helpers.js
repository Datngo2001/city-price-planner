"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatApiResponse = exports.getSkipAndLimit = exports.sanitizeQuery = exports.createError = exports.asyncHandler = exports.generatePagination = void 0;
const generatePagination = (page, limit, totalItems) => {
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
exports.generatePagination = generatePagination;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
exports.createError = createError;
const sanitizeQuery = (query) => {
    const sanitized = {};
    for (const key in query) {
        if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
            sanitized[key] = query[key];
        }
    }
    return sanitized;
};
exports.sanitizeQuery = sanitizeQuery;
const getSkipAndLimit = (page, limit) => {
    const skip = (page - 1) * limit;
    return { skip, limit };
};
exports.getSkipAndLimit = getSkipAndLimit;
const formatApiResponse = (success, message, data, pagination, error) => {
    const response = {
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
exports.formatApiResponse = formatApiResponse;
//# sourceMappingURL=helpers.js.map