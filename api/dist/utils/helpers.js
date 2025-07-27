"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = exports.isValidEmail = exports.generateSlug = exports.toProperCase = exports.removeUndefined = exports.isValidObjectId = exports.calculatePagination = exports.formatResponse = exports.generateRandomString = exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
const generateRandomString = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
const formatResponse = (success, message, data = null, meta = null) => {
    const response = {
        success,
        message
    };
    if (data !== null) {
        response.data = data;
    }
    if (meta !== null) {
        response.meta = meta;
    }
    return response;
};
exports.formatResponse = formatResponse;
const calculatePagination = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
        currentPage: parseInt(page.toString()),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit.toString()),
        hasNextPage: parseInt(page.toString()) < totalPages,
        hasPrevPage: parseInt(page.toString()) > 1
    };
};
exports.calculatePagination = calculatePagination;
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
exports.isValidObjectId = isValidObjectId;
const removeUndefined = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null) {
            cleaned[key] = obj[key];
        }
    });
    return cleaned;
};
exports.removeUndefined = removeUndefined;
const toProperCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
exports.toProperCase = toProperCase;
const generateSlug = (str) => {
    return str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};
exports.generateSlug = generateSlug;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
exports.calculateDistance = calculateDistance;
//# sourceMappingURL=helpers.js.map