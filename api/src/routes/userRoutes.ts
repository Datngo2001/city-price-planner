import { Router } from 'express';
import {
    deleteUser,
    getUserById,
    getUsers,
    updateUser
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { queryParamsSchema, userUpdateSchema, validate, validateQuery } from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and search
 * @access  Private
 */
router.get('/', authenticate, validateQuery(queryParamsSchema), getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (own profile only)
 */
router.put('/:id', authenticate, validate(userUpdateSchema), updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete (deactivate) user
 * @access  Private (own profile only)
 */
router.delete('/:id', authenticate, deleteUser);

export default router;
