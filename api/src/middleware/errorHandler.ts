import { NextFunction, Request, Response } from 'express';
import { IApiResponse } from '../types';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails: any = null;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = Object.values(error.errors).map((err: any) => err.message);
  }
  
  // Mongoose duplicate key error
  else if (error.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
    const field = Object.keys(error.keyValue)[0];
    errorDetails = `${field} already exists`;
  }
  
  // Mongoose cast error
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  // JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Custom error with status code
  else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode,
    });
  }

  const response: IApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : message,
  };

  if (errorDetails) {
    response.error = errorDetails;
  }

  res.status(statusCode).json(response);
};
