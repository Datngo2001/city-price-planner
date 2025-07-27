const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { validateUserUpdate, validatePasswordChange } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/v1/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      role,
      isActive
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Sort options
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sort]: sortOrder };

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/v1/users/:id
// @desc    Get single user by ID
// @access  Private (Own profile or Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is accessing their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user profile'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/v1/users/:id
// @desc    Update user profile
// @access  Private (Own profile or Admin)
router.put('/:id', auth, validateUserUpdate, async (req, res) => {
  try {
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user profile'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent non-admin users from changing sensitive fields
    const allowedFields = ['firstName', 'lastName', 'preferences'];
    if (req.user.role === 'admin') {
      allowedFields.push('username', 'email', 'role', 'isActive');
    }

    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/v1/users/:id
// @desc    Delete user (soft delete by setting isActive to false)
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/v1/users/:id/change-password
// @desc    Change user password
// @access  Private (Own profile only)
router.post('/:id/change-password', auth, validatePasswordChange, async (req, res) => {
  try {
    // Users can only change their own password
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change this password'
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/v1/users/:id/stats
// @desc    Get user statistics (contributions, etc.)
// @access  Private (Own profile or Admin)
router.get('/:id/stats', auth, async (req, res) => {
  try {
    // Check if user is accessing their own stats or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these statistics'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics from related collections
    const Price = require('../models/Price');
    const City = require('../models/City');

    const [priceStats, cityStats] = await Promise.all([
      Price.aggregate([
        { $match: { reportedBy: user._id, isActive: true } },
        {
          $group: {
            _id: null,
            totalPrices: { $sum: 1 },
            categoriesContributed: { $addToSet: '$category' },
            verifiedPrices: {
              $sum: { $cond: [{ $ne: ['$verifiedBy', null] }, 1, 0] }
            }
          }
        }
      ]),
      City.aggregate([
        { $match: { 'metadata.addedBy': user._id, isActive: true } },
        {
          $group: {
            _id: null,
            totalCities: { $sum: 1 },
            countriesContributed: { $addToSet: '$country' },
            verifiedCities: {
              $sum: { $cond: [{ $ne: ['$metadata.verifiedBy', null] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    const stats = {
      prices: priceStats[0] || {
        totalPrices: 0,
        categoriesContributed: [],
        verifiedPrices: 0
      },
      cities: cityStats[0] || {
        totalCities: 0,
        countriesContributed: [],
        verifiedCities: 0
      },
      memberSince: user.createdAt,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        },
        stats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/v1/users/:id/toggle-status
// @desc    Toggle user active status (Admin only)
// @access  Private (Admin only)
router.post('/:id/toggle-status', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own account status'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
