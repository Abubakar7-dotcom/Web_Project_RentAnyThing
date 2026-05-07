import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const [
      totalUsers,
      totalListings,
      totalRentals,
      activeRentals,
      totalRevenue,
      pendingComplaints,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.rental.count(),
      prisma.rental.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
      prisma.complaint.count({ where: { status: 'OPEN' } }),
    ]);

    res.status(200).json({
      totalUsers,
      totalListings,
      totalRentals,
      activeRentals,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingComplaints,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all users with pagination
 */
export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              listings: true,
              rentals: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create a new user
 */
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        phone: true,
        createdAt: true,
      },
    });

    res.status(201).json({ user });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update a user
 */
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, email, role, phone, isActive, password } = req.body;

    const updateData: any = {
      name,
      email,
      role,
      phone,
      isActive,
    };

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: String(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        phone: true,
        createdAt: true,
      },
    });

    res.status(200).json({ user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

/**
 * Delete a user
 */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = String(id);

    // Check if user has active rentals
    const activeRentals = await prisma.rental.count({
      where: {
        OR: [
          { borrowerId: userId, status: { in: ['PENDING', 'ACTIVE'] } },
          { listing: { ownerId: userId }, status: { in: ['PENDING', 'ACTIVE'] } },
        ],
      },
    });

    if (activeRentals > 0) {
      res.status(400).json({ 
        error: 'Cannot delete user with active rentals. Please complete or cancel all rentals first.' 
      });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

/**
 * Toggle user active status
 */
export async function toggleUserStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = String(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        phone: true,
        createdAt: true,
      },
    });

    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
