import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.qA.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.message.deleteMany();
  await prisma.media.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('Password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@rentit.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+1234567890',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1987654321',
    },
  });

  console.log('✅ Created 2 users (1 admin, 1 user)');

  // Categories with emoji icons
  const categories = [
    { name: 'Electronics', emoji: '📱' },
    { name: 'Tools', emoji: '🔧' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Camping', emoji: '⛺' },
    { name: 'Photography', emoji: '📷' },
    { name: 'Music', emoji: '🎸' },
    { name: 'Vehicles', emoji: '🚗' },
    { name: 'Party', emoji: '🎉' },
  ];

  console.log('✅ Defined 8 categories');

  // Create 6 featured listings with media
  const listings = [
    {
      title: 'Professional DSLR Camera',
      description: 'Canon EOS 5D Mark IV with 24-70mm lens. Perfect for professional photography and videography. Includes camera bag and extra batteries.',
      pricePerDay: 75,
      depositAmount: 500,
      category: 'Photography',
      location: 'San Francisco, CA',
      isFeatured: true,
      ownerId: user.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', type: 'image' },
      ],
    },
    {
      title: 'Mountain Bike - Trek X-Caliber',
      description: 'High-performance mountain bike suitable for trails and rough terrain. Recently serviced with new tires.',
      pricePerDay: 35,
      depositAmount: 200,
      category: 'Sports',
      location: 'Denver, CO',
      isFeatured: true,
      ownerId: user.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800', type: 'image' },
      ],
    },
    {
      title: 'Camping Tent - 6 Person',
      description: 'Spacious 6-person tent with rainfly and ground tarp. Easy setup, perfect for family camping trips.',
      pricePerDay: 25,
      depositAmount: 100,
      category: 'Camping',
      location: 'Portland, OR',
      isFeatured: true,
      ownerId: admin.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', type: 'image' },
      ],
    },
    {
      title: 'Power Drill Set - DeWalt',
      description: 'Professional cordless drill set with multiple bits and carrying case. Two batteries included.',
      pricePerDay: 20,
      depositAmount: 80,
      category: 'Tools',
      location: 'Austin, TX',
      isFeatured: true,
      ownerId: admin.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800', type: 'image' },
      ],
    },
    {
      title: 'Electric Guitar - Fender Stratocaster',
      description: 'Classic Fender Stratocaster electric guitar in excellent condition. Includes amplifier and cable.',
      pricePerDay: 40,
      depositAmount: 300,
      category: 'Music',
      location: 'Nashville, TN',
      isFeatured: true,
      ownerId: user.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', type: 'image' },
      ],
    },
    {
      title: 'Party Speaker System',
      description: 'Professional PA system with wireless microphones. Perfect for parties, events, and presentations.',
      pricePerDay: 50,
      depositAmount: 250,
      category: 'Party',
      location: 'Los Angeles, CA',
      isFeatured: true,
      ownerId: admin.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800', type: 'image' },
      ],
    },
  ];

  for (const listingData of listings) {
    const { media, ...listingFields } = listingData;
    await prisma.listing.create({
      data: {
        ...listingFields,
        media: {
          create: media,
        },
      },
    });
  }

  console.log('✅ Created 6 featured listings with media');
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
