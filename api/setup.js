#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up City Price Planner API...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Install dependencies
try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  console.error(error.message);
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Please create one based on .env.example');
} else {
  console.log('✅ .env file found');
}

// Check MongoDB connection
console.log('\n📊 Checking MongoDB connection...');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/city-price-planner';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connection successful');
  mongoose.connection.close();
  
  console.log('\n🎉 Setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update your .env file with your configuration');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Visit http://localhost:3000 to test the API');
  console.log('4. Check http://localhost:3000/health for health status');
  console.log('\nHappy coding! 🚀');
})
.catch((error) => {
  console.log('⚠️  MongoDB connection failed');
  console.log('Please make sure MongoDB is running and the connection string is correct');
  console.log(`Connection string: ${MONGODB_URI}`);
  console.log('\nYou can still run the API, but database operations will fail until MongoDB is available.');
  
  console.log('\n📝 Setup completed with warnings!');
  console.log('\nNext steps:');
  console.log('1. Start MongoDB service');
  console.log('2. Update your .env file with correct MongoDB URI');
  console.log('3. Run "npm run dev" to start the development server');
});
