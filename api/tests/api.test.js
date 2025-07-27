const request = require('supertest');
const app = require('../server');

describe('API Health Check', () => {
  test('GET /health should return API status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('GET / should return API information', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('endpoints');
  });
});

describe('Authentication Routes', () => {
  test('POST /api/v1/auth/register should validate required fields', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
  });

  test('POST /api/v1/auth/login should validate required fields', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
  });
});

describe('Cities Routes', () => {
  test('GET /api/v1/cities should return cities list', async () => {
    const response = await request(app)
      .get('/api/v1/cities')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('cities');
    expect(response.body.data).toHaveProperty('pagination');
  });
});

describe('Prices Routes', () => {
  test('GET /api/v1/prices should return prices list', async () => {
    const response = await request(app)
      .get('/api/v1/prices')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('prices');
    expect(response.body.data).toHaveProperty('pagination');
  });
});
