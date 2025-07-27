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
const mongoose_1 = __importStar(require("mongoose"));
const priceSchema = new mongoose_1.Schema({
    city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'City',
        required: [true, 'City is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'housing',
            'food',
            'transportation',
            'utilities',
            'healthcare',
            'education',
            'entertainment',
            'clothing',
            'services',
            'other'
        ]
    },
    subcategory: {
        type: String,
        required: [true, 'Subcategory is required'],
        trim: true,
        maxlength: [100, 'Subcategory cannot exceed 100 characters']
    },
    item: {
        name: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
            maxlength: [200, 'Item name cannot exceed 200 characters']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        unit: {
            type: String,
            required: [true, 'Unit is required'],
            trim: true,
            maxlength: [50, 'Unit cannot exceed 50 characters']
        }
    },
    price: {
        amount: {
            type: Number,
            required: [true, 'Price amount is required'],
            min: [0, 'Price cannot be negative']
        },
        currency: {
            type: String,
            required: [true, 'Currency is required'],
            uppercase: true,
            length: [3, 'Currency must be exactly 3 characters']
        }
    },
    priceRange: {
        min: {
            type: Number,
            min: [0, 'Minimum price cannot be negative']
        },
        max: {
            type: Number,
            min: [0, 'Maximum price cannot be negative']
        }
    },
    source: {
        type: {
            type: String,
            required: [true, 'Source type is required'],
            enum: ['user_reported', 'official', 'website', 'api', 'survey', 'other']
        },
        name: {
            type: String,
            required: [true, 'Source name is required'],
            trim: true,
            maxlength: [100, 'Source name cannot exceed 100 characters']
        },
        url: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Please enter a valid URL']
        },
        date: {
            type: Date,
            required: [true, 'Source date is required'],
            default: Date.now
        }
    },
    accuracy: {
        level: {
            type: String,
            enum: ['low', 'medium', 'high', 'verified'],
            default: 'medium'
        },
        confidence: {
            type: Number,
            min: [0, 'Confidence must be between 0 and 100'],
            max: [100, 'Confidence must be between 0 and 100'],
            default: 50
        }
    },
    reportedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    verifiedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [String],
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
}, {
    timestamps: true
});
priceSchema.index({ city: 1, category: 1 });
priceSchema.index({ category: 1, subcategory: 1 });
priceSchema.index({ 'item.name': 1 });
priceSchema.index({ 'price.amount': 1 });
priceSchema.index({ 'source.date': -1 });
priceSchema.index({ reportedBy: 1 });
priceSchema.index({ isActive: 1 });
priceSchema.index({ createdAt: -1 });
priceSchema.index({
    'item.name': 'text',
    'item.description': 'text',
    subcategory: 'text',
    tags: 'text'
});
priceSchema.index({ city: 1, category: 1, isActive: 1, createdAt: -1 });
priceSchema.virtual('formattedPrice').get(function () {
    return `${this.price.amount} ${this.price.currency}`;
});
priceSchema.methods.convertTo = function (targetCurrency, exchangeRate) {
    if (this.price.currency === targetCurrency) {
        return this.price.amount;
    }
    return this.price.amount * exchangeRate;
};
priceSchema.pre('save', function (next) {
    if (this.priceRange && this.priceRange.min !== undefined && this.priceRange.max !== undefined) {
        if (this.priceRange.min > this.priceRange.max) {
            next(new Error('Minimum price cannot be greater than maximum price'));
        }
    }
    next();
});
const Price = mongoose_1.default.model('Price', priceSchema);
exports.default = Price;
//# sourceMappingURL=Price.js.map