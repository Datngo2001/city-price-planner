// Test setup file
const mongoose = require('mongoose');

// Setup test database connection
beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/city-price-planner-test';
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
