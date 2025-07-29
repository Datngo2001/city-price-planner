# HTTP Cookie Authentication

The authentication system now uses HTTP-only cookies instead of returning tokens in the response body. This provides better security by preventing XSS attacks from accessing the authentication token.

## How it works

### Registration/Login
When you register or login successfully, the server will:
1. Generate a JWT token
2. Set it as an HTTP-only cookie named `token`
3. Return user information

### Authentication
For protected routes, the server will:
1. First try to read the token from the `token` cookie
2. If no cookie exists, fallback to the Authorization header (`Bearer <token>`)
3. Validate the token and attach user info to the request

### Logout
When you logout, the server will:
1. Clear the `token` cookie
2. Return a success message

## Cookie Configuration

The cookies are configured with the following security settings:
- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` - Only sent over HTTPS in production
- `sameSite: 'strict'` - CSRF protection
- `maxAge: 7 days` - Cookie expiration
- `path: '/'` - Available for all routes

## Frontend Integration

### JavaScript/Fetch Example
```javascript
// Login
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: Include cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Make authenticated requests
const profileResponse = await fetch('/api/v1/auth/me', {
  credentials: 'include' // Important: Include cookies
});

// Logout
const logoutResponse = await fetch('/api/v1/auth/logout', {
  method: 'POST',
  credentials: 'include' // Important: Include cookies
});
```

### Axios Example
```javascript
// Configure axios to include cookies by default
axios.defaults.withCredentials = true;

// Login
const response = await axios.post('/api/v1/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Make authenticated requests (cookies automatically included)
const profile = await axios.get('/api/v1/auth/me');

// Logout
await axios.post('/api/v1/auth/logout');
```

## Backward Compatibility

The system still supports Authorization header authentication as a fallback:
```javascript
// This still works
const response = await fetch('/api/v1/auth/me', {
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
});
```

## Environment Variables

Make sure to set these environment variables:
- `JWT_SECRET` - Secret key for signing JWT tokens
- `NODE_ENV` - Set to 'production' for secure cookies over HTTPS

## Testing with curl

```bash
# Login and save cookies
curl -c cookies.txt -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use cookies for authenticated requests
curl -b cookies.txt http://localhost:3000/api/v1/auth/me

# Logout
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/v1/auth/logout
```
