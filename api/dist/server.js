"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: config_1.default.server.corsOrigin,
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.rateLimit.windowMs,
    max: config_1.default.rateLimit.max,
    message: config_1.default.rateLimit.message,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use((0, compression_1.default)());
if (config_1.default.server.env === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
mongoose_1.default.connect(config_1.default.database.uri, config_1.default.database.options)
    .then(() => {
    logger_1.default.info('Connected to MongoDB successfully');
})
    .catch((error) => {
    logger_1.default.error('MongoDB connection error:', error);
    process.exit(1);
});
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'City Price Planner API is running',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1'
    });
});
const apiVersion = process.env.API_VERSION || 'v1';
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to City Price Planner API',
        version: apiVersion,
        endpoints: {
            health: '/health',
            auth: `/api/${apiVersion}/auth`,
            cities: `/api/${apiVersion}/cities`,
            prices: `/api/${apiVersion}/prices`,
            users: `/api/${apiVersion}/users`
        }
    });
});
app.use(notFound_1.default);
app.use(errorHandler_1.default);
const PORT = config_1.default.server.port;
const server = app.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
    logger_1.default.info(`Environment: ${config_1.default.server.env}`);
    logger_1.default.info(`API Version: ${apiVersion}`);
});
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger_1.default.info('Process terminated');
        mongoose_1.default.connection.close();
    });
});
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger_1.default.info('Process terminated');
        mongoose_1.default.connection.close();
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map