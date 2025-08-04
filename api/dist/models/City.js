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
exports.City = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const citySchema = new mongoose_1.Schema({
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
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
citySchema.index({ name: 1, country: 1 }, { unique: true });
citySchema.index({ country: 1 });
citySchema.index({ region: 1 });
citySchema.index({ isActive: 1 });
citySchema.index({ location: '2dsphere' });
citySchema.virtual('location').get(function () {
    return {
        type: 'Point',
        coordinates: [this.longitude, this.latitude],
    };
});
exports.City = mongoose_1.default.model('City', citySchema);
//# sourceMappingURL=City.js.map