import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST,
    },
  },
});

// Helper to clean up test data
async function cleanupTestData() {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test',
      },
    },
  });
}

describe('Authentication API', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await cleanupTestData();
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data and return 201 with cookie set', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('testuser@example.com');
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.role).toBe('USER');
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned

      // Check that JWT cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/jwt=/);
    });

    it('should return 409 when registering with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'duplicate@example.com',
          password: 'Password123',
        });

      // Attempt duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 3',
          email: 'duplicate@example.com',
          password: 'Password456',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Email already registered');
    });

    it('should return 422 when password is too weak (no uppercase)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'weakpass1@example.com',
          password: 'password123', // No uppercase
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some((e: any) => e.field === 'password')).toBe(true);
    });

    it('should return 422 when password is too weak (no digit)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'weakpass2@example.com',
          password: 'PasswordABC', // No digit
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some((e: any) => e.field === 'password')).toBe(true);
    });

    it('should return 422 when password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'weakpass3@example.com',
          password: 'Pass1', // Too short
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some((e: any) => e.field === 'password')).toBe(true);
    });

    it('should return 422 when name is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'noname@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some((e: any) => e.field === 'name')).toBe(true);
    });

    it('should return 422 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123',
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some((e: any) => e.field === 'email')).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'logintest@example.com',
          password: 'Password123',
        });
    });

    it('should login with valid credentials and return 200 with cookie set', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('logintest@example.com');
      expect(response.body.user.password).toBeUndefined();

      // Check that JWT cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/jwt=/);
    });

    it('should return 401 with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'WrongPassword123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 403 when account is deactivated', async () => {
      // Create a user and deactivate them
      const uniqueEmail = `deactivated-${Date.now()}@example.com`;
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Deactivated User',
          email: uniqueEmail,
          password: 'Password123',
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.user).toBeDefined();
      const userId = registerResponse.body.user.id;

      // Deactivate the user
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });

      // Attempt to login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: uniqueEmail,
          password: 'Password123',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Account deactivated');
    });

    it('should set longer cookie expiry when rememberMe is true', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'Password123',
          rememberMe: true,
        });

      expect(response.status).toBe(200);

      // Check cookie max-age (should be 30 days = 2592000000 ms)
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/Max-Age=2592000/);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear JWT cookie and return 200', async () => {
      // First login to get a cookie
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'Password123',
        });

      const cookies = loginResponse.headers['set-cookie'];

      // Now logout
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');

      // Check that cookie is cleared
      const logoutCookies = response.headers['set-cookie'];
      expect(logoutCookies).toBeDefined();
      expect(logoutCookies[0]).toMatch(/jwt=;/);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return 200 for existing email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'logintest@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    it('should return 200 for non-existent email (to prevent enumeration)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    it('should return 422 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid-email',
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should return 400 for invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token-12345',
          password: 'NewPassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or expired reset token');
    });

    it('should return 422 for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'some-token',
          password: 'weak',
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some((e: any) => e.field === 'password')).toBe(true);
    });
  });
});
