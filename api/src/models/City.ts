import mongoose, { Schema } from 'mongoose';
import { ICity } from '../types';

const citySchema = new Schema<ICity>({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [100, 'Country name cannot exceed 100 characters'],
  },
  region: {
    type: String,
    trim: true,
    maxlength: [100, 'Region name cannot exceed 100 characters'],
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90'],
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180'],
  },
  population: {
    type: Number,
    min: [0, 'Population cannot be negative'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    trim: true,
    uppercase: true,
    minlength: [3, 'Currency code must be 3 characters'],
    maxlength: [3, 'Currency code must be 3 characters'],
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes for performance
citySchema.index({ name: 1, country: 1 }, { unique: true });
citySchema.index({ country: 1 });
citySchema.index({ region: 1 });
citySchema.index({ isActive: 1 });
citySchema.index({ location: '2dsphere' }); // For geospatial queries

// Virtual for location (GeoJSON)
citySchema.virtual('location').get(function() {
  return {
    type: 'Point',
    coordinates: [this.longitude, this.latitude],
  };
});

export const City = mongoose.model<ICity>('City', citySchema);
