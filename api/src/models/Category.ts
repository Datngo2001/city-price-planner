import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../types';

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  icon: {
    type: String,
    trim: true,
    maxlength: [50, 'Icon name cannot exceed 50 characters'],
  },
  color: {
    type: String,
    trim: true,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color'],
  },
  parentId: {
    type: String,
    ref: 'Category',
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
categorySchema.index({ name: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ isActive: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
