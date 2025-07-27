# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string to remote instance)

## Setup & Installation

1. **Navigate to the API directory:**
   ```bash
   cd api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install axios for demo (if not already installed):**
   ```bash
   npm install axios
   ```

4. **Configure environment:**
   - Update the `.env` file with your MongoDB connection string
   - Default MongoDB URI: `mongodb://localhost:27017/city-price-planner`

5. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # OR production mode
   npm start
   ```

## Testing the API

### Method 1: Using the Demo Script
```bash
npm run demo
```

This will:
- Test all main endpoints
- Create sample data (user, city, price)
- Show you how the API works

### Method 2: Manual Testing

1. **Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Register a user:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com", 
       "password": "TestPass123",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

3. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPass123"
     }'
   ```

4. **Use the token from login response in subsequent requests:**
   ```bash
   curl -X GET http://localhost:3000/api/v1/auth/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Method 3: Using Postman or Similar Tools

Import these endpoints into Postman:

**Base URL:** `http://localhost:3000`

**Endpoints:**
- GET `/health` - Health check
- POST `/api/v1/auth/register` - Register user
- POST `/api/v1/auth/login` - Login user
- GET `/api/v1/auth/me` - Get current user (requires auth)
- GET `/api/v1/cities` - Get cities
- POST `/api/v1/cities` - Create city (requires auth)
- GET `/api/v1/prices` - Get prices
- POST `/api/v1/prices` - Create price (requires auth)

## Common Issues

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod`
- Check the connection string in `.env`
- For Windows: Start MongoDB service

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 3000

### Permission Issues (Windows)
- Run PowerShell as Administrator
- Set execution policy: `Set-ExecutionPolicy RemoteSigned`

## Next Steps

1. **Explore the API documentation** in the main README.md
2. **Run tests:** `npm test`
3. **Modify the models** in `/models` directory for your needs
4. **Add more routes** in `/routes` directory
5. **Customize validation** in `/middleware/validation.js`

## API Structure

```
api/
├── config/           # Database configuration
├── middleware/       # Auth, validation, error handling
├── models/          # MongoDB schemas (User, City, Price)
├── routes/          # API endpoints
├── utils/           # Helper functions
├── tests/           # Test files
├── server.js        # Main server file
└── demo.js          # Demo script
```

Happy coding! 🚀
