const express = require('express');
const City = require('../models/City');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { validateCity } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/v1/cities
// @desc    Get all cities with filtering, sorting, and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'name',
      order = 'asc',
      country,
      continent,
      search,
      isActive = true
    } = req.query;

    // Build query
    const query = { isActive };

    if (country) {
      query.country = new RegExp(country, 'i');
    }

    if (continent) {
      query.continent = continent;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sort]: sortOrder };

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const cities = await City.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('metadata.addedBy', 'username firstName lastName')
      .populate('metadata.verifiedBy', 'username firstName lastName');

    const total = await City.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        cities,
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
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/v1/cities/:id
// @desc    Get single city by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id)
      .populate('metadata.addedBy', 'username firstName lastName')
      .populate('metadata.verifiedBy', 'username firstName lastName');

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    res.json({
      success: true,
      data: {
        city
      }
    });
  } catch (error) {
    console.error('Get city error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching city',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/v1/cities
// @desc    Create a new city
// @access  Private
router.post('/', auth, validateCity, async (req, res) => {
  try {
    const cityData = {
      ...req.body,
      metadata: {
        addedBy: req.user.id,
        lastUpdated: new Date()
      }
    };

    const city = await City.create(cityData);
    
    // Populate the created city
    await city.populate('metadata.addedBy', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: {
        city
      }
    });
  } catch (error) {
    console.error('Create city error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating city',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/v1/cities/:id
// @desc    Update a city
// @access  Private
router.put('/:id', auth, validateCity, async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Check if user is admin or the original creator
    if (req.user.role !== 'admin' && city.metadata.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this city'
      });
    }

    const updateData = {
      ...req.body,
      'metadata.lastUpdated': new Date()
    };

    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('metadata.addedBy', 'username firstName lastName')
     .populate('metadata.verifiedBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'City updated successfully',
      data: {
        city: updatedCity
      }
    });
  } catch (error) {
    console.error('Update city error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating city',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/v1/cities/:id
// @desc    Delete a city (soft delete by setting isActive to false)
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Soft delete
    city.isActive = false;
    city.metadata.lastUpdated = new Date();
    await city.save();

    res.json({
      success: true,
      message: 'City deleted successfully'
    });
  } catch (error) {
    console.error('Delete city error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting city',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/v1/cities/:id/verify
// @desc    Verify a city (Admin only)
// @access  Private (Admin only)
router.post('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    city.metadata.verifiedBy = req.user.id;
    city.metadata.verifiedAt = new Date();
    city.metadata.lastUpdated = new Date();
    await city.save();

    await city.populate('metadata.verifiedBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'City verified successfully',
      data: {
        city
      }
    });
  } catch (error) {
    console.error('Verify city error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying city',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/v1/cities/search/nearby
// @desc    Find cities near given coordinates
// @access  Public
router.get('/search/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusInKm)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates or radius'
      });
    }

    // Find cities within radius using MongoDB geospatial query
    const cities = await City.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInKm * 1000 // Convert km to meters
        }
      }
    }).limit(20);

    res.json({
      success: true,
      data: {
        cities,
        searchCenter: {
          latitude,
          longitude
        },
        radius: radiusInKm
      }
    });
  } catch (error) {
    console.error('Nearby cities search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching nearby cities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
