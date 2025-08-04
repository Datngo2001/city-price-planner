"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const priceSchema = new mongoose_1.Schema({
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
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
priceSchema.index({ cityId: 1 });
priceSchema.index({ categoryId: 1 });
priceSchema.index({ category: 1 });
priceSchema.index({ itemName: 1 });
priceSchema.index({ userId: 1 });
priceSchema.index({ dateRecorded: -1 });
priceSchema.index({ isVerified: 1 });
priceSchema.index({ cityId: 1, category: 1 });
priceSchema.index({ cityId: 1, itemName: 1 });
exports.Price = mongoose_1.default.model('Price', priceSchema);
//# sourceMappingURL=Price.js.map