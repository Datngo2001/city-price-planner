# City Price Planner API

A comprehensive RESTful API built with Node.js and MongoDB for managing city price data. This API allows users to contribute, manage, and analyze price information for various goods and services across different cities worldwide.

## Features

- **User Management**: Registration, authentication, and profile management
- **City Management**: Add, update, and manage city information with geographical data
- **Price Tracking**: Comprehensive price data management with categories and verification
- **Role-based Access Control**: User and admin roles with appropriate permissions
- **Data Validation**: Comprehensive input validation and sanitization
- **Search & Filtering**: Advanced search capabilities with pagination
- **Security**: JWT authentication, rate limiting, and security headers
- **Geospatial Queries**: Find nearby cities and location-based searches

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Self-documenting endpoints

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd city-price-planner/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and update the values according to your environment:
   ```bash
   cp .env .env.local
   ```

   Update the following variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/city-price-planner
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Windows with MongoDB service
   net start MongoDB
   
   # Or start mongod manually
   mongod
   ```

5. **Run the application**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/auth/register` | Register a new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| GET | `/api/v1/auth/me` | Get current user | Private |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | Private |
| POST | `/api/v1/auth/logout` | Logout user | Private |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | Owner/Admin |
| PUT | `/api/v1/users/:id` | Update user | Owner/Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |
| POST | `/api/v1/users/:id/change-password` | Change password | Owner |
| GET | `/api/v1/users/:id/stats` | Get user statistics | Owner/Admin |

### City Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/cities` | Get all cities | Public |
| GET | `/api/v1/cities/:id` | Get city by ID | Public |
| POST | `/api/v1/cities` | Create new city | Private |
| PUT | `/api/v1/cities/:id` | Update city | Creator/Admin |
| DELETE | `/api/v1/cities/:id` | Delete city | Admin |
| POST | `/api/v1/cities/:id/verify` | Verify city | Admin |
| GET | `/api/v1/cities/search/nearby` | Find nearby cities | Public |

### Price Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/prices` | Get all prices | Public |
| GET | `/api/v1/prices/:id` | Get price by ID | Public |
| POST | `/api/v1/prices` | Create new price | Private |
| PUT | `/api/v1/prices/:id` | Update price | Creator/Admin |
| DELETE | `/api/v1/prices/:id` | Delete price | Creator/Admin |
| POST | `/api/v1/prices/:id/verify` | Verify price | Admin |
| GET | `/api/v1/prices/city/:cityId` | Get city prices | Public |
| GET | `/api/v1/prices/categories/stats` | Get category stats | Public |

### Utility Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/health` | Health check | Public |
| GET | `/` | API information | Public |

## Request/Response Examples

### User Registration

**Request:**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-12-07T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create a City

**Request:**
```bash
POST /api/v1/cities
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "New York",
  "country": "United States",
  "countryCode": "US",
  "continent": "North America",
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "timezone": "America/New_York",
  "population": 8336817,
  "currency": {
    "code": "USD",
    "name": "US Dollar",
    "symbol": "$"
  },
  "language": {
    "primary": "English"
  }
}
```

### Add a Price

**Request:**
```bash
POST /api/v1/prices
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "city": "507f1f77bcf86cd799439011",
  "category": "food",
  "subcategory": "restaurants",
  "item": {
    "name": "Coffee (Regular)",
    "description": "Regular coffee at a mid-range cafe",
    "unit": "1 cup"
  },
  "price": {
    "amount": 3.50,
    "currency": "USD"
  },
  "source": {
    "type": "user_reported",
    "name": "Personal observation"
  }
}
```

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Sorting
- `sort`: Field to sort by (default varies by endpoint)
- `order`: Sort order 'asc' or 'desc' (default varies by endpoint)

### Filtering
- `search`: Text search across relevant fields
- `category`: Filter by category (for prices)
- `country`: Filter by country (for cities)
- `continent`: Filter by continent (for cities)
- `isActive`: Filter by active status (true/false)

### Example with Query Parameters
```bash
GET /api/v1/prices?city=507f1f77bcf86cd799439011&category=food&page=1&limit=20&sort=createdAt&order=desc
```

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Token Expiration
- Default expiration: 7 days
- Use the refresh endpoint to get a new token
- Tokens are automatically validated on protected routes

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Data Models

### User Model
```javascript
{
  username: String,        // Unique username
  email: String,          // Unique email
  password: String,       // Hashed password
  firstName: String,      // User's first name
  lastName: String,       // User's last name
  role: String,          // 'user' or 'admin'
  isActive: Boolean,     // Account status
  preferences: {
    currency: String,    // Preferred currency
    language: String     // Preferred language
  },
  lastLogin: Date,       // Last login timestamp
  createdAt: Date,       // Account creation date
  updatedAt: Date        // Last update date
}
```

### City Model
```javascript
{
  name: String,              // City name
  country: String,           // Country name
  countryCode: String,       // ISO country code
  continent: String,         // Continent name
  coordinates: {
    latitude: Number,        // Geographical latitude
    longitude: Number        // Geographical longitude
  },
  timezone: String,          // Timezone identifier
  population: Number,        // City population
  currency: {
    code: String,           // Currency code (USD, EUR, etc.)
    name: String,           // Currency full name
    symbol: String          // Currency symbol
  },
  language: {
    primary: String,        // Primary language
    others: [String]        // Other languages
  },
  isActive: Boolean,        // City status
  metadata: {
    addedBy: ObjectId,      // User who added the city
    verifiedBy: ObjectId,   // Admin who verified
    verifiedAt: Date        // Verification timestamp
  }
}
```

### Price Model
```javascript
{
  city: ObjectId,           // Reference to City
  category: String,         // Price category
  subcategory: String,      // Price subcategory
  item: {
    name: String,          // Item name
    description: String,   // Item description
    unit: String           // Unit of measurement
  },
  price: {
    amount: Number,        // Price amount
    currency: String       // Currency code
  },
  priceRange: {
    min: Number,          // Minimum price
    max: Number           // Maximum price
  },
  source: {
    type: String,         // Source type
    name: String,         // Source name
    url: String,          // Source URL
    date: Date            // Source date
  },
  accuracy: {
    level: String,        // Accuracy level
    confidence: Number    // Confidence percentage
  },
  reportedBy: ObjectId,   // User who reported
  verifiedBy: ObjectId,   // Admin who verified
  isActive: Boolean,      // Price status
  tags: [String],         // Additional tags
  notes: String           // Additional notes
}
```

## Development

### Code Structure
```
api/
├── config/           # Configuration files
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # Route definitions
├── utils/           # Utility functions
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run format
```

### Environment Variables
All environment variables are documented in `.env` file. Make sure to:
1. Never commit actual secrets to version control
2. Use strong, unique values for JWT_SECRET in production
3. Update CORS_ORIGIN for your frontend domain

## Deployment

### Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use MongoDB Atlas or a managed MongoDB instance
3. **Security**: Use HTTPS in production
4. **Monitoring**: Implement logging and monitoring
5. **Rate Limiting**: Configure appropriate rate limits
6. **CORS**: Set proper CORS origins

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/` endpoint
- Use the health check endpoint `/health` to verify API status
