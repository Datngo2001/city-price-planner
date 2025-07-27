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
const citySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'City name is required'],
        trim: true,
        maxlength: [100, 'City name cannot exceed 100 characters']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        maxlength: [100, 'Country name cannot exceed 100 characters']
    },
    countryCode: {
        type: String,
        required: [true, 'Country code is required'],
        uppercase: true,
        length: [2, 'Country code must be exactly 2 characters'],
        match: [/^[A-Z]{2}$/, 'Country code must be 2 uppercase letters']
    },
    region: {
        type: String,
        trim: true,
        maxlength: [100, 'Region name cannot exceed 100 characters']
    },
    continent: {
        type: String,
        required: [true, 'Continent is required'],
        enum: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
    },
    coordinates: {
        latitude: {
            type: Number,
            required: [true, 'Latitude is required'],
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90']
        },
        longitude: {
            type: Number,
            required: [true, 'Longitude is required'],
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180']
        }
    },
    timezone: {
        type: String,
        required: [true, 'Timezone is required']
    },
    population: {
        type: Number,
        min: [0, 'Population cannot be negative']
    },
    currency: {
        code: {
            type: String,
            required: [true, 'Currency code is required'],
            uppercase: true,
            length: [3, 'Currency code must be exactly 3 characters']
        },
        name: {
            type: String,
            required: [true, 'Currency name is required']
        },
        symbol: {
            type: String,
            required: [true, 'Currency symbol is required']
        }
    },
    language: {
        primary: {
            type: String,
            required: [true, 'Primary language is required']
        },
        others: [String]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        addedBy: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        verifiedBy: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        },
        verifiedAt: Date,
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});
citySchema.index({ name: 1, country: 1 }, { unique: true });
citySchema.index({ countryCode: 1 });
citySchema.index({ continent: 1 });
citySchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
citySchema.index({ isActive: 1 });
citySchema.index({
    name: 'text',
    country: 'text',
    region: 'text'
});
citySchema.virtual('location').get(function () {
    return `${this.name}, ${this.country}`;
});
citySchema.methods.distanceTo = function (otherCity) {
    const R = 6371;
    const dLat = (otherCity.coordinates.latitude - this.coordinates.latitude) * Math.PI / 180;
    const dLon = (otherCity.coordinates.longitude - this.coordinates.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.coordinates.latitude * Math.PI / 180) *
            Math.cos(otherCity.coordinates.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
const City = mongoose_1.default.model('City', citySchema);
exports.default = City;
//# sourceMappingURL=City.js.map