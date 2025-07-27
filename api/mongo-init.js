// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the city-price-planner database
db = db.getSiblingDB('city-price-planner');

// Create collections with some initial data (optional)
db.createCollection('users');
db.createCollection('cities');
db.createCollection('prices');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.cities.createIndex({ "name": 1, "country": 1 }, { unique: true });
db.cities.createIndex({ "coordinates": "2dsphere" });
db.prices.createIndex({ "cityId": 1, "category": 1 });
db.prices.createIndex({ "createdAt": -1 });

print('Database initialization completed successfully');
