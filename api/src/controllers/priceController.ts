import { Request, Response } from 'express';
import { City } from '../models/City';
import { Price } from '../models/Price';
import { IAuthRequest, IPriceCreate, IPriceUpdate, IQueryParams } from '../types';

export const getPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'dateRecorded', 
      sortOrder = 'desc', 
      search,
      cityId,
      category,
      currency 
    } = req.query as IQueryParams & {
      cityId?: string;
      category?: string;
      currency?: string;
    };

    const query: any = {};

    // Add filters
    if (cityId) query.cityId = cityId;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (currency) query.currency = currency.toUpperCase();

    // Add search functionality
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [prices, totalPrices] = await Promise.all([
      Price.find(query)
        .populate('cityId', 'name country currency')
        .populate('userId', 'username firstName lastName')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Price.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalPrices / limit);

    res.status(200).json({
      success: true,
      message: 'Prices retrieved successfully',
      data: prices,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalPrices,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving prices',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getPriceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const price = await Price.findById(id)
      .populate('cityId', 'name country currency')
      .populate('userId', 'username firstName lastName');

    if (!price) {
      res.status(404).json({
        success: false,
        message: 'Price not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Price retrieved successfully',
      data: price,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving price',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createPrice = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const priceData: IPriceCreate = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Verify city exists
    const city = await City.findById(priceData.cityId);
    if (!city) {
      res.status(400).json({
        success: false,
        message: 'City not found',
      });
      return;
    }

    const price = new Price({
      ...priceData,
      userId: userId.toString(),
    });

    await price.save();

    const populatedPrice = await Price.findById(price._id)
      .populate('cityId', 'name country currency')
      .populate('userId', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Price created successfully',
      data: populatedPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating price',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updatePrice = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: IPriceUpdate = req.body;
    const userId = req.user?._id;

    // Check if price exists
    const price = await Price.findById(id);
    if (!price) {
      res.status(404).json({
        success: false,
        message: 'Price not found',
      });
      return;
    }

    // Check if user owns the price record
    if (price.userId !== userId?.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own price records',
      });
      return;
    }

    const updatedPrice = await Price.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('cityId', 'name country currency')
      .populate('userId', 'username firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Price updated successfully',
      data: updatedPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating price',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deletePrice = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Check if price exists
    const price = await Price.findById(id);
    if (!price) {
      res.status(404).json({
        success: false,
        message: 'Price not found',
      });
      return;
    }

    // Check if user owns the price record
    if (price.userId !== userId?.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own price records',
      });
      return;
    }

    await Price.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Price deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting price',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getPricesByCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cityId } = req.params;
    const { category, limit = 50 } = req.query;

    const query: any = { cityId };
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const prices = await Price.find(query)
      .populate('userId', 'username')
      .sort({ dateRecorded: -1 })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: 'City prices retrieved successfully',
      data: prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving city prices',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getPriceAverages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cityId } = req.params;
    const { category } = req.query;

    const matchStage: any = { cityId };
    if (category) {
      matchStage.category = { $regex: category, $options: 'i' };
    }

    const averages = await Price.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            category: '$category',
            itemName: '$itemName',
            currency: '$currency',
          },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          count: { $sum: 1 },
          lastUpdated: { $max: '$dateRecorded' },
        },
      },
      {
        $project: {
          category: '$_id.category',
          itemName: '$_id.itemName',
          currency: '$_id.currency',
          averagePrice: { $round: ['$averagePrice', 2] },
          minPrice: '$minPrice',
          maxPrice: '$maxPrice',
          count: '$count',
          lastUpdated: '$lastUpdated',
          _id: 0,
        },
      },
      { $sort: { category: 1, itemName: 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Price averages retrieved successfully',
      data: averages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving price averages',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
