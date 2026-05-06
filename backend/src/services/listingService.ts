import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GetListingsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

interface CreateListingData {
  title: string;
  description: string;
  pricePerDay: number;
  category: string;
  location: string;
  depositAmount?: number;
  mediaUrls?: string[];
}

interface UpdateListingData {
  title?: string;
  description?: string;
  pricePerDay?: number;
  category?: string;
  location?: string;
  depositAmount?: number;
}

/**
 * Get listings with optional search, category filter, and pagination
 */
export async function getListings(params: GetListingsParams = {}) {
  const { search, category, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }
  
  if (category) {
    where.category = category;
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      media: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.listing.count({ where });

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single listing by ID with full details
 */
export async function getListing(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      media: true,
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        include: {
          reviewer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      qas: {
        include: {
          asker: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  return listing;
}

/**
 * Create a new listing with media
 */
export async function createListing(ownerId: string, data: CreateListingData) {
  const { mediaUrls = [], ...listingData } = data;

  return await prisma.$transaction(async (tx) => {
    // Create the listing
    const listing = await tx.listing.create({
      data: {
        ...listingData,
        ownerId,
        isAvailable: true,
        isFeatured: false,
        depositAmount: data.depositAmount || 0,
      },
    });

    // Create media records if provided
    if (mediaUrls.length > 0) {
      await tx.media.createMany({
        data: mediaUrls.map((url) => ({
          listingId: listing.id,
          url,
          type: 'image',
        })),
      });
    }

    // Return listing with media
    return await tx.listing.findUnique({
      where: { id: listing.id },
      include: {
        media: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
    });
  });
}

/**
 * Update a listing (owner verification required)
 */
export async function updateListing(id: string, ownerId: string, data: UpdateListingData) {
  // First verify ownership
  const existingListing = await prisma.listing.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!existingListing) {
    throw new Error('Listing not found');
  }

  if (existingListing.ownerId !== ownerId) {
    const error = new Error('Forbidden: You can only update your own listings');
    (error as any).statusCode = 403;
    throw error;
  }

  // Update the listing
  const updatedListing = await prisma.listing.update({
    where: { id },
    data,
    include: {
      media: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  return updatedListing;
}

/**
 * Delete a listing (owner verification required)
 */
export async function deleteListing(id: string, ownerId: string) {
  // First verify ownership
  const existingListing = await prisma.listing.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!existingListing) {
    throw new Error('Listing not found');
  }

  if (existingListing.ownerId !== ownerId) {
    const error = new Error('Forbidden: You can only delete your own listings');
    (error as any).statusCode = 403;
    throw error;
  }

  // Delete the listing (Media will cascade delete due to schema)
  await prisma.listing.delete({
    where: { id },
  });

  return { message: 'Listing deleted successfully' };
}