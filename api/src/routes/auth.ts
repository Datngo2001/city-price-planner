import { auth, optionalAuth } from '@/middleware/auth';
import { handleValidationErrors } from '@/middleware/validation';
import User from '@/models/User';
import { ApiResponse, AuthenticatedRequest } from '@/types';
import logger from '@/utils/logger';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Validation rules for user registration
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and cannot exceed 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and cannot exceed 50 characters'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  
  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules for password change
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('preferences.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'])
    .withMessage('Invalid currency'),
  
  body('preferences.language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja'])
    .withMessage('Invalid language'),
  
  handleValidationErrors
];

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, firstName, lastName, role, preferences } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      } as ApiResponse);
      return;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'user',
      preferences: {
        currency: preferences?.currency || 'USD',
        language: preferences?.language || 'en'
      }
    });

    await user.save();

    // Generate JWT token
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          preferences: user.preferences,
          createdAt: user.createdAt
        }
      }
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    } as ApiResponse);
  }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', validateLogin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      } as ApiResponse);
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          preferences: user.preferences,
          lastLogin: user.lastLogin
        }
      }
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    } as ApiResponse);
  }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */

router.get('/me', auth, async (req, res) => {
  try {
    const user = (req as any).user;

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          preferences: user.preferences,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving profile'
    } as ApiResponse);
  }
});

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, validateProfileUpdate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { firstName, lastName, preferences } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (preferences) {
      if (preferences.currency !== undefined) user.preferences.currency = preferences.currency;
      if (preferences.language !== undefined) user.preferences.language = preferences.language;
    }

    await user.save();

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          preferences: user.preferences,
          updatedAt: user.updatedAt
        }
      }
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    } as ApiResponse);
  }
});

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', auth, validatePasswordChange, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById((req as any).user._id).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      } as ApiResponse);
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    } as ApiResponse);
  }
});

/**
 * @route   POST /api/v1/auth/verify-token
 * @desc    Verify if token is valid
 * @access  Public (but requires token)
 */
router.post('/verify-token', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      } as ApiResponse);
      return;
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      const user = await User.findById((decoded as any).id).select('-password');
      
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid token or user not found'
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          valid: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      } as ApiResponse);

    } catch (jwtError: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      } as ApiResponse);
      return;
    }

  } catch (error: any) {
    logger.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    } as ApiResponse);
  }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    logger.info(`User logged out: ${req.user?.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    } as ApiResponse);
  }
});

export default router;
