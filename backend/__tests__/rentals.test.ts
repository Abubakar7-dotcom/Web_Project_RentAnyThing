import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';
import { signToken } from '../src/utils/tokenUtils';

const prisma = new PrismaClient();

describe('Rentals API', () => {
  let userToken: string;
  let ownerToken: string;
  let userId: string;
  let ownerId: string;
  let listingId: string;

  beforeEach(async () => {
    // Clean up and recreate test data for each test
    await prisma.payment.deleteMany();
    await prisma.rental.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    const user = await prisma.user.create({
      data: {
        name: 'Test Borrower',
        email: 'borrower@test.com',
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    const owner = await prisma.user.create({
      data: {
        name: 'Test Owner',
        email: 'owner@test.com',
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    userId = user.id;
    ownerId = owner.id;
    userToken = signToken(userId, 'USER', false);
    ownerToken = signToken(ownerId, 'USER', false);

    // Create a test listing
    const listing = await prisma.listing.create({
      data: {
        title: 'Test Camera',
        description: 'A great camera for testing',
        pricePerDay: 50,
        category: 'Cameras',
        location: 'Test City',
        ownerId: ownerId,
        isAvailable: true,
      },
    });

    listingId = listing.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.payment.deleteMany();
    await prisma.rental.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/rentals', () => {
    it('should create a rental with valid data', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const rentalData = {
        listingId,
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: dayAfter.toISOString().split('T')[0],
      };

      const response = await request(app)
        .post('/api/rentals')
        .set('Cookie', `jwt=${userToken}`)
        .send(rentalData)
        .expect(201);

      expect(response.body.listingId).toBe(listingId);
      expect(response.body.borrowerId).toBe(userId);
      expect(response.body.status).toBe('PENDING');
      expect(response.body.totalPrice).toBe(50); // 1 day * $50
    });

    it('should return 400 when listing is not available', async () => {
      // Make listing unavailable
      await prisma.listing.update({
        where: { id: listingId },
        data: { isAvailable: false },
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const rentalData = {
        listingId,
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: dayAfter.toISOString().split('T')[0],
      };

      const response = await request(app)
        .post('/api/rentals')
        .set('Cookie', `jwt=${userToken}`)
        .send(rentalData)
        .expect(400);

      expect(response.body.error).toBe('Listing is not available for rent');
    });

    it('should return 400 when user tries to rent their own listing', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const rentalData = {
        listingId,
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: dayAfter.toISOString().split('T')[0],
      };

      const response = await request(app)
        .post('/api/rentals')
        .set('Cookie', `jwt=${ownerToken}`)
        .send(rentalData)
        .expect(400);

      expect(response.body.error).toBe('You cannot rent your own listing');
    });

    it('should return 422 when start date is in the past', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const rentalData = {
        listingId,
        startDate: yesterday.toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0],
      };

      const response = await request(app)
        .post('/api/rentals')
        .set('Cookie', `jwt=${userToken}`)
        .send(rentalData)
        .expect(422);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'startDate',
            message: expect.stringContaining('cannot be in the past'),
          }),
        ])
      );
    });

    it('should require authentication', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const rentalData = {
        listingId,
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: dayAfter.toISOString().split('T')[0],
      };

      await request(app)
        .post('/api/rentals')
        .send(rentalData)
        .expect(401);
    });
  });

  describe('POST /api/rentals/:id/approve', () => {
    let rentalId: string;

    beforeEach(async () => {
      // Create a pending rental
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const rental = await prisma.rental.create({
        data: {
          listingId,
          borrowerId: userId,
          startDate: tomorrow,
          endDate: dayAfter,
          totalPrice: 50,
          status: 'PENDING',
        },
      });

      rentalId = rental.id;
    });

    it('should allow owner to approve rental', async () => {
      const response = await request(app)
        .post(`/api/rentals/${rentalId}/approve`)
        .set('Cookie', `jwt=${ownerToken}`)
        .expect(200);

      expect(response.body.status).toBe('ACTIVE');

      // Check that listing is now unavailable
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
      });
      expect(listing?.isAvailable).toBe(false);
    });

    it('should return 403 when non-owner tries to approve', async () => {
      const response = await request(app)
        .post(`/api/rentals/${rentalId}/approve`)
        .set('Cookie', `jwt=${userToken}`)
        .expect(403);

      expect(response.body.error).toBe('Only the listing owner can approve rentals');
    });

    it('should return 404 for non-existent rental', async () => {
      await request(app)
        .post('/api/rentals/nonexistent-id/approve')
        .set('Cookie', `jwt=${ownerToken}`)
        .expect(404);
    });
  });

  describe('GET /api/rentals', () => {
    it('should return empty array when no rentals exist', async () => {
      const response = await request(app)
        .get('/api/rentals')
        .set('Cookie', `jwt=${userToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return rentals for the authenticated user', async () => {
      // Create a rental
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      await prisma.rental.create({
        data: {
          listingId,
          borrowerId: userId,
          startDate: tomorrow,
          endDate: dayAfter,
          totalPrice: 50,
          status: 'PENDING',
        },
      });

      const response = await request(app)
        .get('/api/rentals')
        .set('Cookie', `jwt=${userToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].borrowerId).toBe(userId);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/rentals')
        .expect(401);
    });
  });
});

describe('Payments API', () => {
  let userToken: string;
  let ownerToken: string;
  let userId: string;
  let ownerId: string;
  let listingId: string;
  let rentalId: string;

  beforeEach(async () => {
    // Clean up and recreate test data for each test
    await prisma.payment.deleteMany();
    await prisma.rental.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    const user = await prisma.user.create({
      data: {
        name: 'Test Borrower',
        email: 'borrower@test.com',
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    const owner = await prisma.user.create({
      data: {
        name: 'Test Owner',
        email: 'owner@test.com',
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    userId = user.id;
    ownerId = owner.id;
    userToken = signToken(userId, 'USER', false);
    ownerToken = signToken(ownerId, 'USER', false);

    // Create a test listing
    const listing = await prisma.listing.create({
      data: {
        title: 'Test Camera',
        description: 'A great camera for testing',
        pricePerDay: 50,
        category: 'Cameras',
        location: 'Test City',
        ownerId: ownerId,
        isAvailable: false, // Set to false since we'll create an active rental
      },
    });

    listingId = listing.id;

    // Create an active rental
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const rental = await prisma.rental.create({
      data: {
        listingId,
        borrowerId: userId,
        startDate: tomorrow,
        endDate: dayAfter,
        totalPrice: 50,
        status: 'ACTIVE',
      },
    });

    rentalId = rental.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.payment.deleteMany();
    await prisma.rental.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/payments/:rentalId/pay', () => {
    it('should process payment for active rental by borrower', async () => {
      const response = await request(app)
        .post(`/api/payments/${rentalId}/pay`)
        .set('Cookie', `jwt=${userToken}`)
        .expect(201);

      expect(response.body.status).toBe('PAID');
      expect(response.body.amount).toBe(50);
      expect(response.body.rentalId).toBe(rentalId);
    });

    it('should return 403 when non-borrower tries to pay', async () => {
      const response = await request(app)
        .post(`/api/payments/${rentalId}/pay`)
        .set('Cookie', `jwt=${ownerToken}`)
        .expect(403);

      expect(response.body.error).toBe('Only the borrower can make payment for this rental');
    });

    it('should return 400 when rental is not active', async () => {
      // Update rental to pending
      await prisma.rental.update({
        where: { id: rentalId },
        data: { status: 'PENDING' },
      });

      const response = await request(app)
        .post(`/api/payments/${rentalId}/pay`)
        .set('Cookie', `jwt=${userToken}`)
        .expect(400);

      expect(response.body.error).toBe('Rental must be active to make payment');
    });

    it('should return 400 when payment already exists', async () => {
      // Create an existing payment
      await prisma.payment.create({
        data: {
          rentalId,
          amount: 50,
          status: 'PAID',
        },
      });

      const response = await request(app)
        .post(`/api/payments/${rentalId}/pay`)
        .set('Cookie', `jwt=${userToken}`)
        .expect(400);

      expect(response.body.error).toBe('Payment has already been made for this rental');
    });

    it('should return 404 for non-existent rental', async () => {
      await request(app)
        .post('/api/payments/nonexistent-id/pay')
        .set('Cookie', `jwt=${userToken}`)
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app)
        .post(`/api/payments/${rentalId}/pay`)
        .expect(401);
    });
  });
});