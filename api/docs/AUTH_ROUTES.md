# Authentication Routes Documentation

This document describes the authentication routes available in the City Price Planner API.

## Base URL
All auth routes are prefixed with `/api/v1/auth`

## Routes

### 1. Register User
**POST** `/api/v1/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "StrongPassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user", // optional, defaults to "user"
  "preferences": { // optional
    "currency": "USD",
    "language": "en"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "user",
      "preferences": {
        "currency": "USD",
        "language": "en"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. Login User
**POST** `/api/v1/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "user",
      "preferences": {
        "currency": "USD",
        "language": "en"
      },
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 3. Get Current User Profile
**GET** `/api/v1/auth/me`

Get the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "user",
      "preferences": {
        "currency": "USD",
        "language": "en"
      },
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 4. Update User Profile
**PUT** `/api/v1/auth/profile`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "preferences": {
    "currency": "EUR",
    "language": "fr"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "fullName": "John Smith",
      "role": "user",
      "preferences": {
        "currency": "EUR",
        "language": "fr"
      },
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 5. Change Password
**PUT** `/api/v1/auth/change-password`

Change the current user's password.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewStrongPassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 6. Verify Token
**POST** `/api/v1/auth/verify-token`

Verify if a JWT token is valid.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "valid": true,
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 7. Logout
**POST** `/api/v1/auth/logout`

Logout the current user (mainly for logging purposes in a stateless JWT system).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message",
      "value": "provided_value"
    }
  ]
}
```

## Common HTTP Status Codes

- **200**: Success
- **201**: Created (for registration)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid credentials or token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

## Authentication

Most routes require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued during login/registration and should be included in all authenticated requests.

## Validation Rules

### Username
- 3-30 characters
- Only letters, numbers, underscores, and hyphens

### Email
- Valid email format
- Normalized to lowercase

### Password
- Minimum 6 characters
- Must contain at least one lowercase letter
- Must contain at least one uppercase letter
- Must contain at least one number

### Names
- 1-50 characters each
- Required for first and last name

### Preferences
- **Currency**: USD, EUR, GBP, JPY, CAD, AUD
- **Language**: en, es, fr, de, it, pt, zh, ja
