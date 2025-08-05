import { Router } from 'express';
import {
    getCities,
    getCityById,
    searchCitiesNearby
} from '../controllers/cityController';
import { queryParamsSchema, validateQuery } from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/cities
 * @desc    Get all cities with pagination and search
 * @access  Public
 */
router.get('/', validateQuery(queryParamsSchema), getCities);

/**
 * @route   GET /api/cities/nearby
 * @desc    Search cities nearby given coordinates
 * @access  Public
 */
router.get('/nearby', searchCitiesNearby);

/**
 * @route   GET /api/cities/:id
 * @desc    Get city by ID
 * @access  Public
 */
router.get('/:id', getCityById);

/**
 * @route   POST /api/cities
 * @desc    Create a new city
 * @access  Private
 */
// router.post('/', authenticate, validate(cityCreateSchema), createCity);

/**
 * @route   PUT /api/cities/:id
 * @desc    Update city
 * @access  Private
 */
// router.put('/:id', authenticate, validate(cityUpdateSchema), updateCity);

/**
 * @route   DELETE /api/cities/:id
 * @desc    Delete (deactivate) city
 * @access  Private
 */
// router.delete('/:id', authenticate, deleteCity);

export default router;
