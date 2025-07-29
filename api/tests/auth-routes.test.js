/**
 * Basic test file for auth routes
 * Run with: npm test -- auth-routes.test.js
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server.ts');

describe('Auth Routes', () => {
  let server;
  let authToken;
  let testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User'
  };

  beforeAll(async () => {
    // Start server
    server = app.listen(3001);
    
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/city-price-planner-test');
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection('users').deleteMany({
        email: testUser.email
      });
    }
    
    // Close connections
    await mongoose.connection.close();
    if (server) {
      server.close();
    }
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
      
      // Save token for other tests
      authToken = response.body.data.token;
    });

    it('should not register user with invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/auth/profile', () => {
    it('should update user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        preferences: {
          currency: 'EUR'
        }
      };

      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe('Updated');
      expect(response.body.data.user.preferences.currency).toBe('EUR');
    });
  });

  describe('POST /api/v1/auth/verify-token', () => {
    it('should verify valid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/verify-token')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/verify-token')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
