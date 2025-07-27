const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  username: 'demo_user',
  email: 'demo@example.com',
  password: 'DemoPass123',
  firstName: 'Demo',
  lastName: 'User'
};

const testCity = {
  name: 'San Francisco',
  country: 'United States',
  countryCode: 'US',
  continent: 'North America',
  coordinates: {
    latitude: 37.7749,
    longitude: -122.4194
  },
  timezone: 'America/Los_Angeles',
  population: 873965,
  currency: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$'
  },
  language: {
    primary: 'English'
  }
};

async function runDemo() {
  try {
    console.log('🚀 Starting City Price Planner API Demo\n');

    // 1. Health Check
    console.log('1. Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API is healthy:', healthResponse.data.message);

    // 2. Register a user
    console.log('\n2. Registering demo user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, testUser);
    console.log('✅ User registered:', registerResponse.data.data.user.username);
    
    const token = registerResponse.data.data.token;
    const userId = registerResponse.data.data.user.id;

    // 3. Login user
    console.log('\n3. Logging in user...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User logged in successfully');

    // 4. Get current user
    console.log('\n4. Getting current user info...');
    const meResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Current user:', meResponse.data.data.user.fullName);

    // 5. Create a city
    console.log('\n5. Creating a city...');
    const cityResponse = await axios.post(`${API_BASE_URL}/api/v1/cities`, testCity, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ City created:', cityResponse.data.data.city.name);
    
    const cityId = cityResponse.data.data.city._id;

    // 6. Get cities
    console.log('\n6. Getting cities list...');
    const citiesResponse = await axios.get(`${API_BASE_URL}/api/v1/cities`);
    console.log('✅ Cities found:', citiesResponse.data.data.cities.length);

    // 7. Add a price
    console.log('\n7. Adding a price...');
    const priceData = {
      city: cityId,
      category: 'food',
      subcategory: 'restaurants',
      item: {
        name: 'Coffee (Regular)',
        description: 'Regular coffee at a mid-range cafe',
        unit: '1 cup'
      },
      price: {
        amount: 4.50,
        currency: 'USD'
      },
      source: {
        type: 'user_reported',
        name: 'Demo data'
      }
    };

    const priceResponse = await axios.post(`${API_BASE_URL}/api/v1/prices`, priceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Price added:', priceResponse.data.data.price.item.name);

    // 8. Get prices
    console.log('\n8. Getting prices list...');
    const pricesResponse = await axios.get(`${API_BASE_URL}/api/v1/prices`);
    console.log('✅ Prices found:', pricesResponse.data.data.prices.length);

    // 9. Get city prices
    console.log('\n9. Getting prices for the city...');
    const cityPricesResponse = await axios.get(`${API_BASE_URL}/api/v1/prices/city/${cityId}`);
    console.log('✅ City prices found:', cityPricesResponse.data.data.prices.length);

    // 10. Search nearby cities (this will be empty since we only have one city)
    console.log('\n10. Searching nearby cities...');
    const nearbyResponse = await axios.get(`${API_BASE_URL}/api/v1/cities/search/nearby?lat=37.7749&lng=-122.4194&radius=100`);
    console.log('✅ Nearby cities found:', nearbyResponse.data.data.cities.length);

    console.log('\n🎉 Demo completed successfully!');
    console.log('\nAPI Endpoints tested:');
    console.log('- Health check');
    console.log('- User registration and login');
    console.log('- City creation and retrieval');
    console.log('- Price creation and retrieval');
    console.log('- Geographical search');
    
    console.log('\n📊 Demo Data Created:');
    console.log(`- User: ${testUser.username} (${testUser.email})`);
    console.log(`- City: ${testCity.name}, ${testCity.country}`);
    console.log(`- Price: ${priceData.item.name} - $${priceData.price.amount}`);

  } catch (error) {
    console.error('\n❌ Demo failed:', error.response?.data?.message || error.message);
    
    if (error.response?.data?.errors) {
      console.log('Validation errors:');
      error.response.data.errors.forEach(err => {
        console.log(`- ${err.param}: ${err.msg}`);
      });
    }
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };
