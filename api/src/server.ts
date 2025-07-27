import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import logger from './utils/logger';

// Import routes (will be uncommented when routes are converted)
// import authRoutes from './routes/auth';
// import cityRoutes from './routes/cities';
// import priceRoutes from './routes/prices';
// import userRoutes from './routes/users';

// Import middleware
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: config.server.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: config.rateLimit.message,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(config.database.uri, config.database.options)
.then(() => {
  logger.info('Connected to MongoDB successfully');
})
.catch((error: Error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'City Price Planner API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

// API routes (will be uncommented when routes are converted)
const apiVersion = process.env.API_VERSION || 'v1';
// app.use(`/api/${apiVersion}/auth`, authRoutes);
// app.use(`/api/${apiVersion}/cities`, cityRoutes);
// app.use(`/api/${apiVersion}/prices`, priceRoutes);
// app.use(`/api/${apiVersion}/users`, userRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
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

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = config.server.port;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${config.server.env}`);
  logger.info(`API Version: ${apiVersion}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close();
  });
});

export default app;
