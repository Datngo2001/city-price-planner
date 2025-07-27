import { Request } from 'express';
import { Document, ObjectId } from 'mongoose';
export interface IUser extends Document {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isActive: boolean;
    lastLogin?: Date;
    preferences: {
        currency: string;
        language: string;
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    fullName: string;
}
export interface IUserInput {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'user' | 'admin';
    preferences?: {
        currency?: string;
        language?: string;
    };
}
export interface ICity extends Document {
    _id: ObjectId;
    name: string;
    country: string;
    countryCode: string;
    region?: string;
    continent: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    timezone: string;
    population?: number;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    language: {
        primary: string;
        others?: string[];
    };
    isActive: boolean;
    metadata: {
        addedBy: ObjectId;
        verifiedBy?: ObjectId;
        verifiedAt?: Date;
        lastUpdated: Date;
    };
    createdAt: Date;
    updatedAt: Date;
    location: string;
    distanceTo(otherCity: ICity): number;
}
export interface ICityInput {
    name: string;
    country: string;
    countryCode: string;
    region?: string;
    continent: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    timezone: string;
    population?: number;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    language: {
        primary: string;
        others?: string[];
    };
}
export interface IPrice extends Document {
    _id: ObjectId;
    city: ObjectId | ICity;
    category: 'housing' | 'food' | 'transportation' | 'utilities' | 'healthcare' | 'education' | 'entertainment' | 'clothing' | 'services' | 'other';
    subcategory: string;
    item: {
        name: string;
        description?: string;
        unit: string;
    };
    price: {
        amount: number;
        currency: string;
    };
    priceRange?: {
        min?: number;
        max?: number;
    };
    source: {
        type: 'user_reported' | 'official' | 'website' | 'api' | 'survey' | 'other';
        name: string;
        url?: string;
        date: Date;
    };
    accuracy: {
        level: 'low' | 'medium' | 'high' | 'verified';
        confidence: number;
    };
    reportedBy: ObjectId | IUser;
    verifiedBy?: ObjectId | IUser;
    verifiedAt?: Date;
    isActive: boolean;
    tags?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    formattedPrice: string;
    convertTo(targetCurrency: string, exchangeRate: number): number;
}
export interface IPriceInput {
    city: string;
    category: 'housing' | 'food' | 'transportation' | 'utilities' | 'healthcare' | 'education' | 'entertainment' | 'clothing' | 'services' | 'other';
    subcategory: string;
    item: {
        name: string;
        description?: string;
        unit: string;
    };
    price: {
        amount: number;
        currency: string;
    };
    priceRange?: {
        min?: number;
        max?: number;
    };
    source: {
        type: 'user_reported' | 'official' | 'website' | 'api' | 'survey' | 'other';
        name: string;
        url?: string;
        date?: Date;
    };
    accuracy?: {
        level?: 'low' | 'medium' | 'high' | 'verified';
        confidence?: number;
    };
    tags?: string[];
    notes?: string;
}
export interface AuthenticatedRequest extends Request {
    user: IUser;
}
export interface OptionalAuthRequest extends Request {
    user?: IUser;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: any;
    errors?: any[];
}
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}
export interface JWTPayload {
    id: string;
    iat?: number;
    exp?: number;
}
export interface BaseQueryParams {
    page?: string;
    limit?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    isActive?: string;
}
export interface CityQueryParams extends BaseQueryParams {
    country?: string;
    continent?: string;
}
export interface PriceQueryParams extends BaseQueryParams {
    city?: string;
    category?: string;
    subcategory?: string;
    minPrice?: string;
    maxPrice?: string;
    currency?: string;
}
export interface UserQueryParams extends BaseQueryParams {
    role?: string;
}
export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface CustomError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export interface Environment {
    NODE_ENV: string;
    PORT: string;
    MONGODB_URI: string;
    DB_NAME: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    API_VERSION: string;
    API_BASE_URL: string;
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX_REQUESTS: string;
    CORS_ORIGIN: string;
}
export interface CategoryStats {
    _id: string;
    count: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    currencies: string[];
}
export interface UserStats {
    prices: {
        totalPrices: number;
        categoriesContributed: string[];
        verifiedPrices: number;
    };
    cities: {
        totalCities: number;
        countriesContributed: string[];
        verifiedCities: number;
    };
    memberSince: Date;
    lastLogin?: Date;
}
//# sourceMappingURL=index.d.ts.map