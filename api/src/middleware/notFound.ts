import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const response: ApiResponse = {
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

export default notFound;
