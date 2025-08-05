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
