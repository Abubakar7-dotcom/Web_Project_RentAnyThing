import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Submit a complaint
 */
export async function submitComplaint(
  reporterId: string,
  data: {
    description: string;
    reportedUserId?: string;
    listingId?: string;
  }
) {
  const { description, reportedUserId, listingId } = data;

  // Validate description
  if (!description || description.trim().length === 0) {
    const error = new Error('Description is required') as any;
    error.statusCode = 422;
    throw error;
  }

  // Validate at least one target is provided
  if (!reportedUserId && !listingId) {
    const error = new Error('Either reportedUserId or listingId must be provided') as any;
    error.statusCode = 422;
    throw error;
  }

  // Verify reported user exists if provided
  if (reportedUserId) {
    const user = await prisma.user.findUnique({
      where: { id: reportedUserId },
    });

    if (!user) {
      const error = new Error('Reported user not found') as any;
      error.statusCode = 404;
      throw error;
    }
  }

  // Verify listing exists if provided
  if (listingId) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      const error = new Error('Listing not found') as any;
      error.statusCode = 404;
      throw error;
    }
  }

  // Create complaint
  const complaint = await prisma.complaint.create({
    data: {
      reporterId,
      reportedUserId: reportedUserId || null,
      listingId: listingId || null,
      description,
      status: 'OPEN',
    },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
        },
      },
      reportedUser: reportedUserId ? {
        select: {
          id: true,
          name: true,
        },
      } : undefined,
      listing: listingId ? {
        select: {
          id: true,
          title: true,
        },
      } : undefined,
    },
  });

  return complaint;
}

/**
 * Get complaints submitted by a user
 */
export async function getComplaints(userId: string) {
  const complaints = await prisma.complaint.findMany({
    where: { reporterId: userId },
    include: {
      reportedUser: {
        select: {
          id: true,
          name: true,
        },
      },
      listing: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return complaints;
}
