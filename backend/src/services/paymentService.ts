import { PrismaClient, PaymentStatus, RentalStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const paymentService = {
  /**
   * Process payment for a rental
   */
  async pay(rentalId: string, userId: string) {
    try {
      // Find the rental
      const rental = await prisma.rental.findUnique({
        where: { id: rentalId },
        include: {
          payment: true,
        },
      });

      if (!rental) {
        throw new Error('Rental not found');
      }

      // Verify borrower is the user making payment
      if (rental.borrowerId !== userId) {
        throw new Error('Only the borrower can make payment for this rental');
      }

      // Verify rental status is ACTIVE
      if (rental.status !== RentalStatus.ACTIVE) {
        throw new Error('Rental must be active to make payment');
      }

      // Check if payment already exists and is PAID
      if (rental.payment && rental.payment.status === PaymentStatus.PAID) {
        throw new Error('Payment has already been made for this rental');
      }

      // Create or update payment
      const payment = await prisma.payment.upsert({
        where: { rentalId },
        create: {
          rentalId,
          amount: rental.totalPrice,
          status: PaymentStatus.PAID,
        },
        update: {
          amount: rental.totalPrice,
          status: PaymentStatus.PAID,
        },
        include: {
          rental: {
            include: {
              listing: {
                select: {
                  id: true,
                  title: true,
                  pricePerDay: true,
                },
              },
              borrower: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return payment;
    } catch (error) {
      // Create failed payment record
      try {
        await prisma.payment.upsert({
          where: { rentalId },
          create: {
            rentalId,
            amount: 0, // Set to 0 for failed payments
            status: PaymentStatus.FAILED,
          },
          update: {
            status: PaymentStatus.FAILED,
          },
        });
      } catch (paymentError) {
        // If we can't even create the failed payment record, just log it
        console.error('Failed to create failed payment record:', paymentError);
      }

      // Re-throw the original error
      throw error;
    }
  },

  /**
   * Get payments for a user
   */
  async getPayments(userId: string) {
    const payments = await prisma.payment.findMany({
      where: {
        rental: {
          borrowerId: userId,
        },
      },
      include: {
        rental: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                pricePerDay: true,
                media: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments;
  },

  /**
   * Get a specific payment
   */
  async getPayment(id: string, userId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        rental: {
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
        },
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Verify user is the borrower
    if (payment.rental.borrowerId !== userId) {
      throw new Error('Access denied');
    }

    return payment;
  },
};