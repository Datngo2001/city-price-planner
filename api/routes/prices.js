const express = require('express');
const Price = require('../models/Price');
const City = require('../models/City');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { validatePrice } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/v1/prices
// @desc    Get all prices with filtering, sorting, and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      city,
      category,
      subcategory,
      search,
      minPrice,
      maxPrice,
      currency,
      isActive = true
    } = req.query;

    // Build query
    const query = { isActive };

    if (city) {
      query.city = city;
    }

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = new RegExp(subcategory, 'i');
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    if (currency) {
      query['price.currency'] = currency.toUpperCase();
    }

    // Sort options
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sort]: sortOrder };

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const prices = await Price.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('city', 'name country countryCode currency')
      .populate('reportedBy', 'username firstName lastName')
      .populate('verifiedBy', 'username firstName lastName');

    const total = await Price.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        prices,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/v1/prices/:id
// @desc    Get single price by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const price = await Price.findById(req.params.id)
      .populate('city', 'name country countryCode currency coordinates')
      .populate('reportedBy', 'username firstName lastName')
      .populate('verifiedBy', 'username firstName lastName');

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

    res.json({
      success: true,
      data: {
        price
      }
    });
  } catch (error) {
    console.error('Get price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching price',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/v1/prices
// @desc    Create a new price entry
// @access  Private
router.post('/', auth, validatePrice, async (req, res) => {
  try {
    // Verify that the city exists
    const city = await City.findById(req.body.city);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    const priceData = {
      ...req.body,
      reportedBy: req.user.id
    };

    const price = await Price.create(priceData);
    
    // Populate the created price
    await price.populate('city', 'name country countryCode currency');
    await price.populate('reportedBy', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Price created successfully',
      data: {
        price
      }
    });
  } catch (error) {
    console.error('Create price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating price',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/v1/prices/:id
// @desc    Update a price
// @access  Private
router.put('/:id', auth, validatePrice, async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

    // Check if user is admin or the original reporter
    if (req.user.role !== 'admin' && price.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this price'
      });
    }

    // Verify that the city exists if it's being updated
    if (req.body.city) {
      const city = await City.findById(req.body.city);
      if (!city) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }
    }

    const updatedPrice = await Price.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('city', 'name country countryCode currency')
     .populate('reportedBy', 'username firstName lastName')
     .populate('verifiedBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Price updated successfully',
      data: {
        price: updatedPrice
      }
    });
  } catch (error) {
    console.error('Update price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating price',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/v1/prices/:id
// @desc    Delete a price (soft delete by setting isActive to false)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

    // Check if user is admin or the original reporter
    if (req.user.role !== 'admin' && price.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this price'
      });
    }

    // Soft delete
    price.isActive = false;
    await price.save();

    res.json({
      success: true,
      message: 'Price deleted successfully'
    });
  } catch (error) {
    console.error('Delete price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting price',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/v1/prices/:id/verify
// @desc    Verify a price (Admin only)
// @access  Private (Admin only)
router.post('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

    price.verifiedBy = req.user.id;
    price.verifiedAt = new Date();
    price.accuracy.level = 'verified';
    price.accuracy.confidence = 100;
    await price.save();

    await price.populate('verifiedBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Price verified successfully',
      data: {
        price
      }
    });
  } catch (error) {
    console.error('Verify price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying price',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/v1/prices/city/:cityId
// @desc    Get all prices for a specific city
// @access  Public
router.get('/city/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const {
      page = 1,
      limit = 10,
      category,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Verify city exists
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Build query
    const query = { city: cityId, isActive: true };
    if (category) {
      query.category = category;
    }

    // Sort options
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sort]: sortOrder };

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const prices = await Price.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reportedBy', 'username firstName lastName')
      .populate('verifiedBy', 'username firstName lastName');

    const total = await Price.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        city: {
          id: city._id,
          name: city.name,
          country: city.country
        },
        prices,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get city prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching city prices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/v1/prices/categories/stats
// @desc    Get price statistics by category
// @access  Public
router.get('/categories/stats', async (req, res) => {
  try {
    const { city } = req.query;
    
    const matchStage = { isActive: true };
    if (city) {
      matchStage.city = new mongoose.Types.ObjectId(city);
    }

    const stats = await Price.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price.amount' },
          minPrice: { $min: '$price.amount' },
          maxPrice: { $max: '$price.amount' },
          currencies: { $addToSet: '$price.currency' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
