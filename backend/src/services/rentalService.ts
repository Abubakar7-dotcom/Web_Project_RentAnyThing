import { PrismaClient, RentalStatus } from '@prisma/client';
import { calculateTotalPrice } from '../utils/calculateDays';

const prisma = new PrismaClient();

export const rentalService = {
  /**
   * Create a new rental
   */
  async createRental(
    borrowerId: string,
    listingId: string,
    startDate: string,
    endDate: string
  ) {
    // Fetch the listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (!listing.isAvailable) {
      throw new Error('Listing is not available for rent');
    }

    if (listing.ownerId === borrowerId) {
      throw new Error('You cannot rent your own listing');
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(listing.pricePerDay, startDate, endDate);

    // Create the rental
    const rental = await prisma.rental.create({
      data: {
        listingId,
        borrowerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        status: RentalStatus.PENDING,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            pricePerDay: true,
            media: true,
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return rental;
  },

  /**
   * Get rentals for a user (as borrower or owner)
   */
  async getRentals(userId: string) {
    const rentals = await prisma.rental.findMany({
      where: {
        OR: [
          { borrowerId: userId },
          { listing: { ownerId: userId } },
        ],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            pricePerDay: true,
            media: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return rentals;
  },

  /**
   * Get a specific rental
   */
  async getRental(id: string, userId: string) {
    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            media: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    // Verify user is borrower or owner
    if (rental.borrowerId !== userId && rental.listing.ownerId !== userId) {
      throw new Error('Access denied');
    }

    return rental;
  },

  /**
   * Approve a rental (owner only)
   */
  async approveRental(id: string, ownerId: string) {
    return await prisma.$transaction(async (tx) => {
      // Find the rental
      const rental = await tx.rental.findUnique({
        where: { id },
        include: {
          listing: true,
        },
      });

      if (!rental) {
        throw new Error('Rental not found');
      }

      if (rental.listing.ownerId !== ownerId) {
        throw new Error('Only the listing owner can approve rentals');
      }

      if (rental.status !== RentalStatus.PENDING) {
        throw new Error('Only pending rentals can be approved');
      }

      // Update rental status to ACTIVE
      const updatedRental = await tx.rental.update({
        where: { id },
        data: { status: RentalStatus.ACTIVE },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              pricePerDay: true,
              media: true,
            },
          },
          borrower: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Set listing as unavailable
      await tx.listing.update({
        where: { id: rental.listingId },
        data: { isAvailable: false },
      });

      return updatedRental;
    });
  },

  /**
   * Complete a rental (owner only)
   */
  async completeRental(id: string, ownerId: string) {
    return await prisma.$transaction(async (tx) => {
      // Find the rental
      const rental = await tx.rental.findUnique({
        where: { id },
        include: {
          listing: true,
        },
      });

      if (!rental) {
        throw new Error('Rental not found');
      }

      if (rental.listing.ownerId !== ownerId) {
        throw new Error('Only the listing owner can complete rentals');
      }

      if (rental.status !== RentalStatus.ACTIVE) {
        throw new Error('Only active rentals can be completed');
      }

      // Update rental status to COMPLETED
      const updatedRental = await tx.rental.update({
        where: { id },
        data: { status: RentalStatus.COMPLETED },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              pricePerDay: true,
              media: true,
            },
          },
          borrower: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Set listing as available again
      await tx.listing.update({
        where: { id: rental.listingId },
        data: { isAvailable: true },
      });

      return updatedRental;
    });
  },

  /**
   * Cancel a rental (borrower or owner)
   */
  async cancelRental(id: string, userId: string) {
    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        listing: true,
      },
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    // Verify user is borrower or owner
    if (rental.borrowerId !== userId && rental.listing.ownerId !== userId) {
      throw new Error('Only the borrower or listing owner can cancel rentals');
    }

    if (rental.status !== RentalStatus.PENDING) {
      throw new Error('Only pending rentals can be cancelled');
    }

    const updatedRental = await prisma.rental.update({
      where: { id },
      data: { status: RentalStatus.CANCELLED },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            pricePerDay: true,
            media: true,
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedRental;
  },
};