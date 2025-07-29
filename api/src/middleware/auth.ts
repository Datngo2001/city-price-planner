import User from '@/models/User';
import { ApiResponse, AuthenticatedRequest, JWTPayload, OptionalAuthRequest } from '@/types';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided or invalid format'
      } as ApiResponse);
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      } as ApiResponse);
      return;
    }

    // Add user to request
    req.user = user;

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      } as ApiResponse);
      return;
    }
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      } as ApiResponse);
      return;
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    } as ApiResponse);
  }
};

// Middleware to check for specific roles
const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      } as ApiResponse);
      return;
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req: OptionalAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

export {
  auth,
  authorize,
  optionalAuth
};

