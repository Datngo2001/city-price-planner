# 🐳 Docker Support for City Price Planner API

This guide explains how to run the City Price Planner API using Docker and Docker Compose.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start

### Development Mode
```bash
# Start development environment with hot reload
npm run docker:up:dev

# View logs
npm run docker:logs:dev
```

### Production Mode
```bash
# Start production environment
npm run docker:up

# View logs
npm run docker:logs
```

### Stop Services
```bash
# Stop all services
npm run docker:down
```

## 🏗️ Docker Commands

### Building Images
```bash
# Build production image
npm run docker:build

# Build development image
npm run docker:build:dev
```

### Running Containers
```bash
# Run production container
npm run docker:run

# Run development container with volume mounting
npm run docker:run:dev
```

## 📦 Services Overview

### 🗄️ MongoDB Database
- **Image**: `mongo:7-jammy`
- **Port**: `27017`
- **Database**: `city-price-planner`
- **Credentials**: 
  - Username: `admin`
  - Password: `password123`

### 🚀 API Service
- **Port**: `3000`
- **Health Check**: `http://localhost:3000/health`
- **Environment**: Configurable via `.env.docker`

### ⚡ Redis Cache (Optional)
- **Image**: `redis:7-alpine`
- **Port**: `6379`
- **Profile**: `cache`

## 🔧 Configuration

### Environment Variables
Copy and modify `.env.docker` for your environment:
```bash
cp .env.docker .env.production
# Edit .env.production with your settings
```

### Security Notes
⚠️ **IMPORTANT**: Change the following in production:
- `JWT_SECRET`: Use a strong, unique secret
- MongoDB credentials
- CORS origins

## 📊 Profiles

Docker Compose uses profiles to manage different environments:

- **`development`**: Hot reload, source mounting
- **`production`**: Optimized, built image
- **`cache`**: Includes Redis service

### Using Profiles
```bash
# Development with cache
docker-compose --profile development --profile cache up -d

# Production with cache
docker-compose --profile production --profile cache up -d
```

## 🔍 Monitoring & Debugging

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f mongodb
docker-compose logs -f api
```

### Access Containers
```bash
# API container
docker exec -it city-price-planner-api sh

# MongoDB container
docker exec -it city-price-planner-db mongosh
```

### Health Checks
```bash
# API health
curl http://localhost:3000/health

# MongoDB health
docker exec city-price-planner-db mongosh --eval "db.adminCommand('ping')"
```

## 🛠️ Development Workflow

1. **Start development environment**:
   ```bash
   npm run docker:up:dev
   ```

2. **Make code changes** - they'll be reflected immediately

3. **View logs**:
   ```bash
   npm run docker:logs:dev
   ```

4. **Stop when done**:
   ```bash
   npm run docker:down
   ```

## 🚀 Production Deployment

1. **Build the image**:
   ```bash
   npm run docker:build
   ```

2. **Update environment variables** in `.env.docker`

3. **Deploy**:
   ```bash
   npm run docker:up
   ```

4. **Verify deployment**:
   ```bash
   curl http://localhost:3000/health
   ```

## 🔄 Data Persistence

- **MongoDB data**: Stored in `mongodb_data` volume
- **Redis data**: Stored in `redis_data` volume
- **Application logs**: Mounted to container's `/app/logs`

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check what's using port 3000
   netstat -ano | findstr :3000
   ```

2. **Database connection issues**:
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   ```

3. **Permission issues**:
   ```bash
   # Reset volumes
   docker-compose down -v
   docker-compose up -d
   ```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v
docker system prune -f
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
