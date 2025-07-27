"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error('Error:', err);
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = {
            message,
            statusCode: 404
        };
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error = {
            message,
            statusCode: 400
        };
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = {
            message,
            statusCode: 400
        };
    }
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = {
            message,
            statusCode: 401
        };
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = {
            message,
            statusCode: 401
        };
    }
    const statusCode = error.statusCode || err.statusCode || 500;
    const message = error.message || 'Server Error';
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            meta: {
                stack: err.stack,
                error: err
            }
        })
    };
    res.status(statusCode).json(response);
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map