"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorDetails = null;
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errorDetails = Object.values(error.errors).map((err) => err.message);
    }
    else if (error.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value';
        const field = Object.keys(error.keyValue)[0];
        errorDetails = `${field} already exists`;
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    else if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
    }
    if (process.env.NODE_ENV === 'development') {
        console.error('Error Details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            statusCode,
        });
    }
    const response = {
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.message : message,
    };
    if (errorDetails) {
        response.error = errorDetails;
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map