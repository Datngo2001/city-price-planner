import { Request } from 'express';
import { Document } from 'mongoose';
export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IUserCreate {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface IUserUpdate {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
}
export interface IAuthRequest extends Request {
    user?: IUser;
    params: any;
    body: any;
}
export interface ILoginRequest {
    email: string;
    password: string;
}
export interface IAuthResponse {
    user: Omit<IUser, 'password'>;
    token: string;
}
export interface ICity extends Document {
    _id: string;
    name: string;
    country: string;
    region?: string;
    latitude: number;
    longitude: number;
    population?: number;
    currency: string;
    timezone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICityCreate {
    name: string;
    country: string;
    region?: string;
    latitude: number;
    longitude: number;
    population?: number;
    currency: string;
    timezone: string;
}
export interface ICityUpdate {
    name?: string;
    country?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    population?: number;
    currency?: string;
    timezone?: string;
    isActive?: boolean;
}
export interface IPrice extends Document {
    _id: string;
    cityId: string;
    categoryId: string;
    category: string;
    subcategory?: string;
    itemName: string;
    price: number;
    currency: string;
    unit?: string;
    source?: string;
    notes?: string;
    dateRecorded: Date;
    userId: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IPriceCreate {
    cityId: string;
    categoryId: string;
    category: string;
    subcategory?: string;
    itemName: string;
    price: number;
    currency: string;
    unit?: string;
    source?: string;
    notes?: string;
    dateRecorded?: Date;
}
export interface IPriceUpdate {
    categoryId?: string;
    category?: string;
    subcategory?: string;
    itemName?: string;
    price?: number;
    currency?: string;
    unit?: string;
    source?: string;
    notes?: string;
    dateRecorded?: Date;
    isVerified?: boolean;
}
export interface ICategory extends Document {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICategoryCreate {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: string;
}
export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: IPagination;
}
export interface IPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface IQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filter?: Record<string, any>;
}
export interface IJwtPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}
//# sourceMappingURL=index.d.ts.map