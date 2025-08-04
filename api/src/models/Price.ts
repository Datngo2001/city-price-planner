import mongoose, { Schema } from 'mongoose';
import { IPrice } from '../types';

const priceSchema = new Schema<IPrice>({
  cityId: {
    type: String,
    required: [true, 'City ID is required'],
    ref: 'City',
  },
  categoryId: {
    type: String,
    required: [true, 'Category ID is required'],
    ref: 'Category',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters'],
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters'],
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [200, 'Item name cannot exceed 200 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    trim: true,
    uppercase: true,
    minlength: [3, 'Currency code must be 3 characters'],
    maxlength: [3, 'Currency code must be 3 characters'],
  },
  unit: {
    type: String,
    trim: true,
    maxlength: [50, 'Unit cannot exceed 50 characters'],
  },
  source: {
    type: String,
    trim: true,
    maxlength: [200, 'Source cannot exceed 200 characters'],
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  dateRecorded: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User',
  },
  isVerified: {
    type: Boolean,
    default: false,
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
priceSchema.index({ cityId: 1 });
priceSchema.index({ categoryId: 1 });
priceSchema.index({ category: 1 });
priceSchema.index({ itemName: 1 });
priceSchema.index({ userId: 1 });
priceSchema.index({ dateRecorded: -1 });
priceSchema.index({ isVerified: 1 });
priceSchema.index({ cityId: 1, category: 1 });
priceSchema.index({ cityId: 1, itemName: 1 });

export const Price = mongoose.model<IPrice>('Price', priceSchema);
