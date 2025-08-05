import { Router } from 'express';
import {
    getPriceAverages,
    getPriceById,
    getPrices,
    getPricesByCity
} from '../controllers/priceController';
import { queryParamsSchema, validateQuery } from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/prices
 * @desc    Get all prices with pagination, search and filters
 * @access  Public
 */
router.get('/', validateQuery(queryParamsSchema), getPrices);

/**
 * @route   GET /api/prices/:id
 * @desc    Get price by ID
 * @access  Public
 */
router.get('/:id', getPriceById);

/**
 * @route   POST /api/prices
 * @desc    Create a new price record
 * @access  Private
 */
// router.post('/', authenticate, validate(priceCreateSchema), createPrice);

/**
 * @route   PUT /api/prices/:id
 * @desc    Update price record
 * @access  Private (own records only)
 */
// router.put('/:id', authenticate, validate(priceUpdateSchema), updatePrice);

/**
 * @route   DELETE /api/prices/:id
 * @desc    Delete price record
 * @access  Private (own records only)
 */
// router.delete('/:id', authenticate, deletePrice);

/**
 * @route   GET /api/prices/city/:cityId
 * @desc    Get all prices for a specific city
 * @access  Public
 */
router.get('/city/:cityId', getPricesByCity);

/**
 * @route   GET /api/prices/city/:cityId/averages
 * @desc    Get price averages for a specific city
 * @access  Public
 */
router.get('/city/:cityId/averages', getPriceAverages);

export default router;
