# Environment Configuration Guide

This project uses multiple environment files for different development stages:

## Environment Files

### 1. `.env.development` (Recommended for team development)
- Uses local MongoDB on port 27017
- Development-friendly JWT secret
- Relaxed rate limiting (1000 requests per 15 min)
- Debug logging enabled
- Allows multiple CORS origins

### 2. `.env.local` (For personal local development)
- Personal overrides for your local machine
- Very relaxed rate limiting
- Maximum logging verbosity
- Auto-seeding enabled
- **This file is gitignored**

### 3. `.env` (Production template)
- Contains production-ready placeholders
- Requires MongoDB Atlas or production MongoDB
- Secure JWT configuration
- Strict rate limiting

## Quick Setup

### Option 1: Using npm scripts (Recommended)
```bash
# Set up development environment
npm run env:dev

# Set up local personal environment  
npm run env:local

# Set up production template
npm run env:prod

# Then start the server
npm run dev
```

### Option 2: Manual setup
```bash
# Copy the environment file you want to use
cp .env.development .env
# or
cp .env.local .env

# Edit .env with your specific settings
# Then start the server
npm run dev
```

## MongoDB Setup

### Local MongoDB (Recommended for development)
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### MongoDB Atlas (Cloud alternative)
1. Create account at https://mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in your .env file

## Environment Variables Explained

| Variable | Description | Development Value | Production Notes |
|----------|-------------|-------------------|------------------|
| `NODE_ENV` | Runtime environment | `development` | Should be `production` |
| `PORT` | Server port | `3000` | Set by hosting platform |
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/...` | Use MongoDB Atlas |
| `JWT_SECRET` | JWT signing key | Simple string | Use strong random key |
| `RATE_LIMIT_MAX_REQUESTS` | Requests per window | `1000` (relaxed) | `100` (strict) |
| `CORS_ORIGIN` | Allowed origins | Multiple localhost | Specific domains |
| `LOG_LEVEL` | Logging verbosity | `debug` | `info` or `warn` |

## Security Notes

- Never commit `.env` files with real credentials
- The `.env.local` file is already gitignored
- Change JWT_SECRET for production
- Use environment variables in production, not files

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# macOS/Linux  
ps aux | grep mongod

# Start MongoDB if not running
# See "MongoDB Setup" section above
```

### Port Already in Use
```bash
# Find what's using port 3000
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Kill the process or change PORT in .env
```

### Module Not Found Errors
```bash
# Reinstall dependencies
npm install

# Clear npm cache
npm cache clean --force
```
