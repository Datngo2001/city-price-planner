import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { Category } from '../models/Category';
import { City } from '../models/City';

dotenv.config();

// Sample cities data
const cities = [
  {
    name: 'New York',
    country: 'United States',
    region: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    population: 8336817,
    currency: 'USD',
    timezone: 'America/New_York',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    region: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    population: 8982000,
    currency: 'GBP',
    timezone: 'Europe/London',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Kanto',
    latitude: 35.6762,
    longitude: 139.6503,
    population: 13960000,
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
  },
  {
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
    population: 2161000,
    currency: 'EUR',
    timezone: 'Europe/Paris',
  },
  {
    name: 'Sydney',
    country: 'Australia',
    region: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    population: 5312163,
    currency: 'AUD',
    timezone: 'Australia/Sydney',
  },
  {
    name: 'Ho Chi Minh City',
    country: 'Vietnam',
    region: 'Ho Chi Minh',
    latitude: 10.8231,
    longitude: 106.6297,
    population: 8400000,
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
  }
];

// Sample categories data
const categories = [
  {
    name: 'Food & Dining',
    description: 'Restaurant meals, groceries, and beverages',
    icon: '🍽️',
    color: '#FF6B6B',
  },
  {
    name: 'Transportation',
    description: 'Public transport, taxis, and fuel costs',
    icon: '🚗',
    color: '#4ECDC4',
  },
  {
    name: 'Housing',
    description: 'Rent, utilities, and housing-related expenses',
    icon: '🏠',
    color: '#45B7D1',
  },
  {
    name: 'Entertainment',
    description: 'Movies, concerts, and recreational activities',
    icon: '🎬',
    color: '#96CEB4',
  },
  {
    name: 'Shopping',
    description: 'Clothing, electronics, and retail goods',
    icon: '🛍️',
    color: '#FFEAA7',
  },
  {
    name: 'Healthcare',
    description: 'Medical services and pharmaceutical costs',
    icon: '🏥',
    color: '#DDA0DD',
  },
];

async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    await City.deleteMany({});
    await Category.deleteMany({});

    // Insert cities
    const insertedCities = await City.insertMany(cities);
    console.log(`✅ Inserted ${insertedCities.length} cities`);

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };

