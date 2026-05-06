import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';
import { signToken } from '../src/utils/tokenUtils';

const prisma = new PrismaClient();

describe('Listings API', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;
  let listingId: string;

  beforeAll(async () => {
    // Clean up test data in correct order to respect foreign key constraints
    // Use where clause to only delete test data from this suite
    await prisma.payment.deleteMany({
      where: {
        rental: {
          listing: {
            owner: {
              email: {
                in: ['user@test.com', 'admin@test.com', 'other@test.com']
              }
            }
          }
        }
      }
    });
    await prisma.rental.deleteMany({
      where: {
        listing: {
          owner: {
            email: {
              in: ['user@test.com', 'admin@test.com', 'other@test.com']
            }
          }
        }
      }
    });
    await prisma.listing.deleteMany({
      where: {
        owner: {
          email: {
            in: ['user@test.com', 'admin@test.com', 'other@test.com']
          }
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['user@test.com', 'admin@test.com', 'other@test.com']
        }
      }
    });
  });

  beforeEach(async () => {
    // Clean up and recreate test users for each test to avoid race conditions
    // Delete in correct order to respect foreign key constraints
    // Use where clause to only delete test data from this suite
    await prisma.payment.deleteMany({
      where: {
        rental: {
          listing: {
            owner: {
              email: {
                in: ['user@test.com', 'admin@test.com', 'other@test.com']
              }
            }
          }
        }
      }
    });
    await prisma.rental.deleteMany({
      where: {
        listing: {
          owner: {
            email: {
              in: ['user@test.com', 'admin@test.com', 'other@test.com']
            }
          }
        }
      }
    });
    await prisma.listing.deleteMany({
      where: {
        owner: {
          email: {
            in: ['user@test.com', 'admin@test.com', 'other@test.com']
          }
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['user@test.com', 'admin@test.com', 'other@test.com']
        }
      }
    });

    // Create test users
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'user@test.com',
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    const admin = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'hashedpassword',
        role: 'ADMIN',
      },
    });

    userId = user.id;
    adminId = admin.id;
    userToken = signToken(userId, 'USER', false);
    adminToken = signToken(adminId, 'ADMIN', false);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.payment.deleteMany();
    await prisma.rental.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/listings', () => {
    it('should return empty array when no listings exist', async () => {
      const response = await request(app)
        .get('/api/listings')
        .set('Cookie', `jwt=${userToken}`)
        .expect(200);

      expect(response.body.listings).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return listings array when listings exist', async () => {
      // Create a test listing
      await prisma.listing.create({
        data: {
          title: 'Test Camera',
          description: 'A great camera for testing',
          pricePerDay: 50,
          category: 'Cameras',
          location: 'Test City',
          ownerId: userId,
        },
      });

      const response = await request(app)
        .get('/api/listings')
        .set('Cookie', `jwt=${userToken}`)
        .expect(200);

      expect(response.body.listings).toHaveLength(1);
      expect(response.body.listings[0].title).toBe('Test Camera');
      expect(response.body.pagination.total).toBe(1);
    });

    it('should filter listings by search parameter', async () => {
      // Create test listings
      await prisma.listing.createMany({
        data: [
          {
            title: 'Canon Camera',
            description: 'Professional camera',
            pricePerDay: 50,
            category: 'Cameras',
            location: 'Test City',
            ownerId: userId,
          },
          {
            title: 'Sony Headphones',
            description: 'Great sound quality',
            pricePerDay: 25,
            category: 'Electronics',
            location: 'Test City',
            ownerId: userId,
          },
        ],
      });

      const response = await request(app)
        .get('/api/listings?search=camera')
        .set('Cookie', `jwt=${userToken}`)
        .expect(200);

      expect(response.body.listings).toHaveLength(1);
      expect(response.body.listings[0].title).toBe('Canon Camera');
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/listings')
        .expect(401);
    });
  });

  describe('POST /api/listings', () => {
    const validListingData = {
      title: 'Test Listing',
      description: 'A test listing description',
      pricePerDay: 30,
      category: 'Electronics',
      location: 'Test Location',
      depositAmount: 100,
    };

    it('should create a listing with valid data when authenticated', async () => {
      const response = await request(app)
        .post('/api/listings')
        .set('Cookie', `jwt=${userToken}`)
        .send(validListingData)
        .expect(201);

      expect(response.body.title).toBe(validListingData.title);
      expect(response.body.ownerId).toBe(userId);
      expect(response.body.isAvailable).toBe(true);
      expect(response.body.isFeatured).toBe(false);

      listingId = response.body.id;
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/listings')
        .send(validListingData)
        .expect(401);
    });

    it('should return 422 when title is missing', async () => {
      const invalidData = { ...validListingData };
      delete (invalidData as any).title;

      const response = await request(app)
        .post('/api/listings')
        .set('Cookie', `jwt=${userToken}`)
        .send(invalidData)
        .expect(422);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: expect.stringContaining('required'),
          }),
        ])
      );
    });

    it('should return 422 when price is zero or negative', async () => {
      const invalidData = { ...validListingData, pricePerDay: 0 };

      const response = await request(app)
        .post('/api/listings')
        .set('Cookie', `jwt=${userToken}`)
        .send(invalidData)
        .expect(422);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'pricePerDay',
            message: expect.stringContaining('positive number greater than 0'),
          }),
        ])
      );
    });

    it('should return 422 when title is too short', async () => {
      const invalidData = { ...validListingData, title: 'AB' };

      const response = await request(app)
        .post('/api/listings')
        .set('Cookie', `jwt=${userToken}`)
        .send(invalidData)
        .expect(422);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: expect.stringContaining('between 3 and 100 characters'),
          }),
        ])
      );
    });
  });

  describe('PUT /api/listings/:id', () => {
    let testListingId: string;

    beforeEach(async () => {
      // Create a test listing owned by the first user
      const listing = await prisma.listing.create({
        data: {
          title: 'Original Title',
          description: 'Original description',
          pricePerDay: 40,
          category: 'Electronics',
          location: 'Original Location',
          ownerId: userId,
        },
      });
      testListingId = listing.id;
    });

    it('should allow owner to update their listing', async () => {
      const updateData = {
        title: 'Updated Title',
        pricePerDay: 60,
      };

      const response = await request(app)
        .put(`/api/listings/${testListingId}`)
        .set('Cookie', `jwt=${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.pricePerDay).toBe(60);
    });

    it('should return 403 when non-owner tries to update', async () => {
      // Create another user for this test
      const otherUser = await prisma.user.create({
        data: {
          name: 'Other User',
          email: 'other@test.com',
          password: 'hashedpassword',
          role: 'USER',
        },
      });
      const otherUserToken = signToken(otherUser.id, 'USER', false);

      const updateData = {
        title: 'Hacked Title',
      };

      await request(app)
        .put(`/api/listings/${testListingId}`)
        .set('Cookie', `jwt=${otherUserToken}`)
        .send(updateData)
        .expect(403);
    });

    it('should return 404 for non-existent listing', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      await request(app)
        .put('/api/listings/nonexistent-id')
        .set('Cookie', `jwt=${userToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/listings/:id', () => {
    let testListingId: string;

    beforeEach(async () => {
      // Create a test listing owned by the first user
      const listing = await prisma.listing.create({
        data: {
          title: 'To Be Deleted',
          description: 'This will be deleted',
          pricePerDay: 40,
          category: 'Electronics',
          location: 'Test Location',
          ownerId: userId,
        },
      });
      testListingId = listing.id;
    });

    it('should allow owner to delete their listing', async () => {
      await request(app)
        .delete(`/api/listings/${testListingId}`)
        .set('Cookie', `jwt=${userToken}`)
        .expect(200);

      // Verify listing is deleted
      const listing = await prisma.listing.findUnique({
        where: { id: testListingId },
      });
      expect(listing).toBeNull();
    });

    it('should return 403 when non-owner tries to delete', async () => {
      // Create another user for this test
      const otherUser = await prisma.user.create({
        data: {
          name: 'Other User',
          email: 'other@test.com',
          password: 'hashedpassword',
          role: 'USER',
        },
      });
      const otherUserToken = signToken(otherUser.id, 'USER', false);

      await request(app)
        .delete(`/api/listings/${testListingId}`)
        .set('Cookie', `jwt=${otherUserToken}`)
        .expect(403);

      // Verify listing still exists
      const listing = await prisma.listing.findUnique({
        where: { id: testListingId },
      });
      expect(listing).not.toBeNull();
    });

    it('should return 404 for non-existent listing', async () => {
      await request(app)
        .delete('/api/listings/nonexistent-id')
        .set('Cookie', `jwt=${userToken}`)
        .expect(404);
    });
  });
});