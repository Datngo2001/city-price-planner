import { Request, Response } from 'express';
import { City } from '../models/City';
import { IAuthRequest, ICityCreate, ICityUpdate, IQueryParams } from '../types';

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', search } = req.query as IQueryParams;

    const query: any = { isActive: true };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [cities, totalCities] = await Promise.all([
      City.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      City.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCities / limit);

    res.status(200).json({
      success: true,
      message: 'Cities retrieved successfully',
      data: cities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCities,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving cities',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const city = await City.findById(id);

    if (!city) {
      res.status(404).json({
        success: false,
        message: 'City not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'City retrieved successfully',
      data: city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving city',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createCity = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const cityData: ICityCreate = req.body;

    // Check if city already exists
    const existingCity = await City.findOne({
      name: cityData.name,
      country: cityData.country,
    });

    if (existingCity) {
      res.status(400).json({
        success: false,
        message: 'City already exists in this country',
      });
      return;
    }

    const city = new City(cityData);
    await city.save();

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating city',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateCity = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: ICityUpdate = req.body;

    // Check if city exists
    const city = await City.findById(id);
    if (!city) {
      res.status(404).json({
        success: false,
        message: 'City not found',
      });
      return;
    }

    // Check for duplicate if name or country is being updated
    if (updateData.name || updateData.country) {
      const duplicateQuery: any = { _id: { $ne: id } };
      duplicateQuery.name = updateData.name || city.name;
      duplicateQuery.country = updateData.country || city.country;

      const existingCity = await City.findOne(duplicateQuery);
      if (existingCity) {
        res.status(400).json({
          success: false,
          message: 'City with this name already exists in this country',
        });
        return;
      }
    }

    const updatedCity = await City.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'City updated successfully',
      data: updatedCity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating city',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteCity = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const city = await City.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!city) {
      res.status(404).json({
        success: false,
        message: 'City not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'City deactivated successfully',
      data: city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting city',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const searchCitiesNearby = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
      return;
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusInKm = parseFloat(radius as string);

    if (isNaN(lat) || isNaN(lng) || isNaN(radiusInKm)) {
      res.status(400).json({
        success: false,
        message: 'Invalid coordinates or radius',
      });
      return;
    }

    // Convert radius from km to radians (divide by Earth's radius in km)
    const radiusInRadians = radiusInKm / 6371;

    const cities = await City.find({
      isActive: true,
      $expr: {
        $lte: [
          {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: [{ $degreesToRadians: '$latitude' }, lat * Math.PI / 180] }, 2] },
                {
                  $pow: [
                    {
                      $multiply: [
                        { $cos: { $degreesToRadians: '$latitude' } },
                        { $subtract: [{ $degreesToRadians: '$longitude' }, lng * Math.PI / 180] }
                      ]
                    },
                    2
                  ]
                }
              ]
            }
          },
          radiusInRadians
        ]
      }
    });

    res.status(200).json({
      success: true,
      message: 'Nearby cities retrieved successfully',
      data: cities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching nearby cities',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
