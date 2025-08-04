# City Price Planner API

A RESTful API built with Express.js, TypeScript, and MongoDB for managing city price data. This API allows users to track and compare prices of various items across different cities worldwide.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with user registration and login
- 🏙️ **City Management**: Create, read, update, and delete city information
- 💰 **Price Tracking**: Add, update, and manage price data for various items
- 📊 **Price Analytics**: Get price averages and comparisons by city and category
- 🔍 **Search & Filtering**: Advanced search and filtering capabilities
- 🌍 **Geospatial Queries**: Find cities within a specific radius
- 📄 **Pagination**: Efficient pagination for large datasets
- ✅ **Data Validation**: Comprehensive input validation using Joi
- 🛡️ **Security**: Rate limiting, CORS, helmet, and other security middleware
- 🧪 **Testing**: Comprehensive test suite with Jest

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Joi** - Data validation
- **Jest** - Testing framework
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/city-price-planner
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Build for production
   npm run build
   
   # Start production server
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johnsmith",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Smith"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Cities

#### Get All Cities
```http
GET /api/cities?page=1&limit=10&search=london
```

#### Get City by ID
```http
GET /api/cities/:id
```

#### Create City
```http
POST /api/cities
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "London",
  "country": "United Kingdom",
  "region": "England",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "population": 8982000,
  "currency": "GBP",
  "timezone": "Europe/London"
}
```

#### Find Nearby Cities
```http
GET /api/cities/nearby?latitude=51.5074&longitude=-0.1278&radius=100
```

### Prices

#### Get All Prices
```http
GET /api/prices?page=1&limit=10&cityId=...&category=food
```

#### Create Price Record
```http
POST /api/prices
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "cityId": "city-id-here",
  "categoryId": "category-id-here",
  "category": "Food & Dining",
  "subcategory": "Restaurant",
  "itemName": "Coffee (Regular)",
  "price": 3.50,
  "currency": "USD",
  "unit": "cup",
  "source": "Local cafe",
  "notes": "Average price at downtown location"
}
```

#### Get Price Averages by City
```http
GET /api/prices/city/:cityId/averages?category=food
```

### Users

#### Get All Users
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```http
PUT /api/users/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── authController.ts
│   ├── cityController.ts
│   ├── priceController.ts
│   └── userController.ts
├── middleware/           # Custom middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── notFoundHandler.ts
│   └── validation.ts
├── models/              # Mongoose models
│   ├── Category.ts
│   ├── City.ts
│   ├── Price.ts
│   └── User.ts
├── routes/              # Route definitions
│   ├── authRoutes.ts
│   ├── cityRoutes.ts
│   ├── priceRoutes.ts
│   └── userRoutes.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── helpers.ts
├── config/              # Configuration files
│   └── database.ts
├── __tests__/           # Test files
│   ├── setup.ts
│   └── auth.test.ts
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/city-price-planner` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

The tests use an in-memory MongoDB instance for isolation and speed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License
