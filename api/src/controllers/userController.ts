import { Request, Response } from 'express';
import { User } from '../models/User';
import { IAuthRequest, IQueryParams, IUserUpdate } from '../types';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query as IQueryParams;

    const query: any = { isActive: true };

    // Add search functionality
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-password'),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalUsers,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateUser = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: IUserUpdate = req.body;
    const currentUserId = req.user?._id;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if user is updating their own profile or has admin rights
    if (id !== currentUserId?.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      });
      return;
    }

    // Check for duplicate username or email if being updated
    if (updateData.username || updateData.email) {
      const duplicateQuery: any = { _id: { $ne: id } };
      
      if (updateData.username && updateData.email) {
        duplicateQuery.$or = [
          { username: updateData.username },
          { email: updateData.email },
        ];
      } else if (updateData.username) {
        duplicateQuery.username = updateData.username;
      } else if (updateData.email) {
        duplicateQuery.email = updateData.email;
      }

      const existingUser = await User.findOne(duplicateQuery);
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Username or email already exists',
        });
        return;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteUser = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id;

    // Check if user is deleting their own account
    if (id !== currentUserId?.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own account',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
