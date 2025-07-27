"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    const response = {
        success: false,
        message: `Route ${req.originalUrl} not found`,
        data: {
            availableEndpoints: {
                health: '/health',
                auth: '/api/v1/auth',
                cities: '/api/v1/cities',
                prices: '/api/v1/prices',
                users: '/api/v1/users'
            }
        }
    };
    res.status(404).json(response);
};
exports.default = notFound;
//# sourceMappingURL=notFound.js.map