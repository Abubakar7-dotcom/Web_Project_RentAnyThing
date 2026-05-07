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

  const john = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1987654321',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1555123456',
    },
  });

  const mike = await prisma.user.create({
    data: {
      name: 'Mike Chen',
      email: 'mike@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1555987654',
    },
  });

  const emma = await prisma.user.create({
    data: {
      name: 'Emma Wilson',
      email: 'emma@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1555246810',
    },
  });

  const david = await prisma.user.create({
    data: {
      name: 'David Martinez',
      email: 'david@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1555369258',
    },
  });

  console.log('✅ Created 6 users (1 admin, 5 regular users)');

  // Create comprehensive listings with media
  const listings = [
    // Photography
    {
      title: 'Professional DSLR Camera - Canon EOS 5D Mark IV',
      description: 'Canon EOS 5D Mark IV with 24-70mm f/2.8 lens. Perfect for professional photography and videography. Includes camera bag, extra batteries, memory cards, and lens cleaning kit. Great for weddings, events, or personal projects.',
      pricePerDay: 75,
      depositAmount: 500,
      category: 'Photography',
      location: 'San Francisco, CA',
      isFeatured: true,
      ownerId: john.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', type: 'image' },
      ],
    },
    {
      title: 'DJI Mavic 3 Pro Drone with 4K Camera',
      description: 'Professional drone with Hasselblad camera, 4K video recording, and 46-minute flight time. Perfect for aerial photography and videography. Includes 3 batteries, carrying case, and ND filters.',
      pricePerDay: 95,
      depositAmount: 800,
      category: 'Photography',
      location: 'Los Angeles, CA',
      isFeatured: true,
      ownerId: sarah.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800', type: 'image' },
      ],
    },
    {
      title: 'GoPro Hero 12 Black Action Camera',
      description: 'Latest GoPro with 5.3K video, waterproof up to 33ft. Includes chest mount, head strap, and extra batteries. Perfect for adventure sports and travel.',
      pricePerDay: 30,
      depositAmount: 150,
      category: 'Photography',
      location: 'Denver, CO',
      isFeatured: false,
      ownerId: mike.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800', type: 'image' },
      ],
    },

    // Sports Equipment
    {
      title: 'Mountain Bike - Trek X-Caliber 9',
      description: 'High-performance mountain bike with 29" wheels, carbon frame, and hydraulic disc brakes. Recently serviced with new tires. Perfect for trails and rough terrain. Helmet included.',
      pricePerDay: 35,
      depositAmount: 200,
      category: 'Sports',
      location: 'Denver, CO',
      isFeatured: true,
      ownerId: john.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800', type: 'image' },
      ],
    },
    {
      title: 'Surfboard - 7ft Soft Top Beginner Board',
      description: 'Perfect beginner surfboard with soft foam top for safety. Includes leash and board bag. Great for learning or casual surfing.',
      pricePerDay: 25,
      depositAmount: 100,
      category: 'Sports',
      location: 'San Diego, CA',
      isFeatured: false,
      ownerId: emma.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800', type: 'image' },
      ],
    },
    {
      title: 'Kayak - 2-Person Inflatable with Paddles',
      description: 'Durable inflatable kayak for 2 people. Includes paddles, pump, and carrying bag. Perfect for lakes and calm rivers.',
      pricePerDay: 40,
      depositAmount: 150,
      category: 'Sports',
      location: 'Seattle, WA',
      isFeatured: false,
      ownerId: david.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', type: 'image' },
      ],
    },

    // Camping
    {
      title: 'Camping Tent - 6 Person Family Tent',
      description: 'Spacious 6-person tent with rainfly, ground tarp, and room divider. Easy 10-minute setup. Perfect for family camping trips. Includes stakes and carrying bag.',
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
      title: 'Camping Stove - Coleman Dual Fuel',
      description: 'Reliable camping stove with two burners. Works with propane or unleaded gas. Includes fuel canister and carrying case.',
      pricePerDay: 15,
      depositAmount: 50,
      category: 'Camping',
      location: 'Portland, OR',
      isFeatured: false,
      ownerId: sarah.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800', type: 'image' },
      ],
    },
    {
      title: 'Sleeping Bags - Set of 4 (20°F Rating)',
      description: 'Four high-quality sleeping bags rated for 20°F. Compact and lightweight. Perfect for family camping trips.',
      pricePerDay: 20,
      depositAmount: 80,
      category: 'Camping',
      location: 'Boulder, CO',
      isFeatured: false,
      ownerId: mike.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=800', type: 'image' },
      ],
    },

    // Tools
    {
      title: 'Power Drill Set - DeWalt 20V MAX',
      description: 'Professional cordless drill/driver set with 100+ pieces including bits, sockets, and carrying case. Two 20V batteries and fast charger included. Perfect for home projects.',
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
      title: 'Pressure Washer - 3000 PSI Electric',
      description: 'Powerful electric pressure washer for cleaning driveways, decks, and siding. Includes multiple nozzles and detergent tank.',
      pricePerDay: 35,
      depositAmount: 150,
      category: 'Tools',
      location: 'Houston, TX',
      isFeatured: false,
      ownerId: david.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800', type: 'image' },
      ],
    },
    {
      title: 'Ladder - 24ft Extension Aluminum',
      description: 'Professional-grade aluminum extension ladder. Lightweight yet sturdy, supports up to 300 lbs. Perfect for painting, roofing, or tree trimming.',
      pricePerDay: 25,
      depositAmount: 100,
      category: 'Tools',
      location: 'Phoenix, AZ',
      isFeatured: false,
      ownerId: john.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800', type: 'image' },
      ],
    },

    // Music
    {
      title: 'Electric Guitar - Fender Stratocaster',
      description: 'Classic Fender Stratocaster electric guitar in sunburst finish. Excellent condition with new strings. Includes 50W amplifier, cable, strap, and picks. Perfect for practice or gigs.',
      pricePerDay: 40,
      depositAmount: 300,
      category: 'Music',
      location: 'Nashville, TN',
      isFeatured: true,
      ownerId: john.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', type: 'image' },
      ],
    },
    {
      title: 'DJ Controller - Pioneer DDJ-400',
      description: 'Professional DJ controller with Rekordbox software license. Perfect for parties and events. Includes headphones and carrying case.',
      pricePerDay: 55,
      depositAmount: 400,
      category: 'Music',
      location: 'Miami, FL',
      isFeatured: false,
      ownerId: emma.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800', type: 'image' },
      ],
    },
    {
      title: 'Keyboard - Yamaha P-125 Digital Piano',
      description: '88-key weighted digital piano with stand and sustain pedal. Perfect for practice, performances, or recording.',
      pricePerDay: 35,
      depositAmount: 250,
      category: 'Music',
      location: 'Chicago, IL',
      isFeatured: false,
      ownerId: sarah.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800', type: 'image' },
      ],
    },

    // Electronics
    {
      title: 'PlayStation 5 Console with 2 Controllers',
      description: 'PS5 console with disc drive, two DualSense controllers, and 5 popular games. Perfect for gaming parties or trying before buying.',
      pricePerDay: 45,
      depositAmount: 400,
      category: 'Electronics',
      location: 'San Jose, CA',
      isFeatured: true,
      ownerId: mike.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800', type: 'image' },
      ],
    },
    {
      title: 'Projector - 4K Home Theater with Screen',
      description: 'High-quality 4K projector with 120" portable screen. Perfect for movie nights, presentations, or gaming. Includes HDMI cables.',
      pricePerDay: 60,
      depositAmount: 350,
      category: 'Electronics',
      location: 'Atlanta, GA',
      isFeatured: false,
      ownerId: david.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800', type: 'image' },
      ],
    },

    // Party
    {
      title: 'Party Speaker System - JBL PartyBox 310',
      description: 'Professional PA system with wireless microphones and RGB lights. 240W output, Bluetooth connectivity. Perfect for parties, events, and presentations. Includes stand and cables.',
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
    {
      title: 'Karaoke Machine with 2 Wireless Mics',
      description: 'Professional karaoke system with built-in screen, 10,000+ songs, and two wireless microphones. Perfect for parties!',
      pricePerDay: 40,
      depositAmount: 200,
      category: 'Party',
      location: 'Las Vegas, NV',
      isFeatured: false,
      ownerId: emma.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', type: 'image' },
      ],
    },
    {
      title: 'Photo Booth Kit with Props',
      description: 'Complete photo booth setup with ring light, backdrop stand, and 50+ fun props. Includes tablet with photo booth app.',
      pricePerDay: 55,
      depositAmount: 200,
      category: 'Party',
      location: 'New York, NY',
      isFeatured: false,
      ownerId: sarah.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', type: 'image' },
      ],
    },

    // Vehicles
    {
      title: 'Cargo Van - Ford Transit 250',
      description: 'Spacious cargo van perfect for moving, deliveries, or hauling equipment. Clean interior, reliable, and fuel efficient.',
      pricePerDay: 85,
      depositAmount: 300,
      category: 'Vehicles',
      location: 'Dallas, TX',
      isFeatured: true,
      ownerId: david.id,
      media: [
        { url: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800', type: 'image' },
      ],
    },
  ];

  const createdListings = [];
  for (const listingData of listings) {
    const { media, ...listingFields } = listingData;
    const listing = await prisma.listing.create({
      data: {
        ...listingFields,
        media: {
          create: media,
        },
      },
    });
    createdListings.push(listing);
  }

  console.log(`✅ Created ${createdListings.length} listings with media`);

  // Create completed rentals with reviews
  const completedRentals = [
    {
      listingId: createdListings[0].id, // Canon Camera
      borrowerId: sarah.id,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      totalPrice: 150,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Amazing camera! Perfect for my wedding shoot. John was very helpful and the equipment was in pristine condition. Will definitely rent again!',
        reviewerId: sarah.id,
      },
    },
    {
      listingId: createdListings[1].id, // DJI Drone
      borrowerId: john.id,
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-12'),
      totalPrice: 190,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Incredible drone! Got stunning aerial footage for my project. Sarah provided great tips on flying it. Worth every penny!',
        reviewerId: john.id,
      },
    },
    {
      listingId: createdListings[2].id, // GoPro
      borrowerId: emma.id,
      startDate: new Date('2024-02-05'),
      endDate: new Date('2024-02-07'),
      totalPrice: 60,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Perfect for my skiing trip! Waterproof and easy to use. All the mounts were included. Highly recommend!',
        reviewerId: emma.id,
      },
    },
    {
      listingId: createdListings[3].id, // Mountain Bike
      borrowerId: mike.id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-03'),
      totalPrice: 70,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Great bike for the trails! Smooth ride and well-maintained. The owner was flexible with pickup time. Highly recommend!',
        reviewerId: mike.id,
      },
    },
    {
      listingId: createdListings[4].id, // Surfboard
      borrowerId: david.id,
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-03-22'),
      totalPrice: 50,
      status: 'COMPLETED' as const,
      review: {
        rating: 4,
        comment: 'Good beginner board. Helped me learn the basics. Only wish it came with wax, but overall great experience!',
        reviewerId: david.id,
      },
    },
    {
      listingId: createdListings[5].id, // Kayak
      borrowerId: sarah.id,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-03'),
      totalPrice: 80,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Fantastic kayak for two! Easy to inflate and very stable on the water. Had an amazing time exploring the lake!',
        reviewerId: sarah.id,
      },
    },
    {
      listingId: createdListings[6].id, // Camping Tent
      borrowerId: emma.id,
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-12'),
      totalPrice: 50,
      status: 'COMPLETED' as const,
      review: {
        rating: 4,
        comment: 'Spacious tent, easy to set up. Perfect for our family camping trip. Only minor issue was a small tear in the rainfly, but it didn\'t affect our stay.',
        reviewerId: emma.id,
      },
    },
    {
      listingId: createdListings[7].id, // Camping Stove
      borrowerId: john.id,
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-17'),
      totalPrice: 30,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Reliable stove that worked perfectly throughout our camping trip. Cooked all our meals without any issues!',
        reviewerId: john.id,
      },
    },
    {
      listingId: createdListings[8].id, // Sleeping Bags
      borrowerId: mike.id,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-22'),
      totalPrice: 40,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Warm and comfortable sleeping bags! Kept us cozy even in 25°F weather. Great quality for the price!',
        reviewerId: mike.id,
      },
    },
    {
      listingId: createdListings[9].id, // Power Drill
      borrowerId: john.id,
      startDate: new Date('2024-02-20'),
      endDate: new Date('2024-02-21'),
      totalPrice: 20,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Exactly what I needed for my home project. Powerful drill with all the bits I needed. Great value!',
        reviewerId: john.id,
      },
    },
    {
      listingId: createdListings[10].id, // Pressure Washer
      borrowerId: sarah.id,
      startDate: new Date('2024-03-25'),
      endDate: new Date('2024-03-26'),
      totalPrice: 35,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Powerful washer! Cleaned my driveway in half the time I expected. Easy to use and very effective!',
        reviewerId: sarah.id,
      },
    },
    {
      listingId: createdListings[11].id, // Ladder
      borrowerId: emma.id,
      startDate: new Date('2024-04-10'),
      endDate: new Date('2024-04-11'),
      totalPrice: 25,
      status: 'COMPLETED' as const,
      review: {
        rating: 4,
        comment: 'Sturdy ladder that made painting my house much easier. A bit heavy to move around but very stable.',
        reviewerId: emma.id,
      },
    },
    {
      listingId: createdListings[12].id, // Fender Guitar
      borrowerId: david.id,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-03'),
      totalPrice: 80,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Beautiful guitar with amazing tone. Used it for a gig and it performed flawlessly. The amp included was a nice bonus!',
        reviewerId: david.id,
      },
    },
    {
      listingId: createdListings[13].id, // DJ Controller
      borrowerId: mike.id,
      startDate: new Date('2024-02-14'),
      endDate: new Date('2024-02-15'),
      totalPrice: 55,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Professional equipment! Used it for a Valentine\'s party and everyone loved the music. Easy to set up and use!',
        reviewerId: mike.id,
      },
    },
    {
      listingId: createdListings[14].id, // Keyboard
      borrowerId: john.id,
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-12'),
      totalPrice: 70,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Excellent keyboard with realistic piano feel. Perfect for practice before buying my own. Highly recommend!',
        reviewerId: john.id,
      },
    },
    {
      listingId: createdListings[15].id, // PS5
      borrowerId: sarah.id,
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-17'),
      totalPrice: 90,
      status: 'COMPLETED' as const,
      review: {
        rating: 4,
        comment: 'Great for a gaming weekend! All games worked perfectly. Would have given 5 stars but one controller had a sticky button.',
        reviewerId: sarah.id,
      },
    },
    {
      listingId: createdListings[16].id, // Projector
      borrowerId: emma.id,
      startDate: new Date('2024-04-05'),
      endDate: new Date('2024-04-06'),
      totalPrice: 60,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Amazing movie night experience! 4K quality was stunning. Setup was easy and the screen was included. Perfect!',
        reviewerId: emma.id,
      },
    },
    {
      listingId: createdListings[17].id, // Party Speaker
      borrowerId: mike.id,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-02'),
      totalPrice: 50,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Made our party amazing! Sound quality was incredible and the lights added great atmosphere. Easy to set up too!',
        reviewerId: mike.id,
      },
    },
    {
      listingId: createdListings[18].id, // Karaoke Machine
      borrowerId: david.id,
      startDate: new Date('2024-03-08'),
      endDate: new Date('2024-03-09'),
      totalPrice: 40,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'So much fun! Huge song library and great sound quality. Everyone at the party had a blast singing!',
        reviewerId: david.id,
      },
    },
    {
      listingId: createdListings[19].id, // Photo Booth
      borrowerId: sarah.id,
      startDate: new Date('2024-02-28'),
      endDate: new Date('2024-03-01'),
      totalPrice: 55,
      status: 'COMPLETED' as const,
      review: {
        rating: 5,
        comment: 'Perfect for our wedding! Guests loved taking photos with all the props. Created amazing memories!',
        reviewerId: sarah.id,
      },
    },
    {
      listingId: createdListings[20].id, // Cargo Van
      borrowerId: john.id,
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-04-16'),
      totalPrice: 85,
      status: 'COMPLETED' as const,
      review: {
        rating: 4,
        comment: 'Spacious van that made moving easy. Clean and reliable. Only issue was the gas mileage, but expected for a van.',
        reviewerId: john.id,
      },
    },
  ];

  for (const rentalData of completedRentals) {
    const { review, ...rentalFields } = rentalData;
    const rental = await prisma.rental.create({
      data: {
        ...rentalFields,
        payment: {
          create: {
            amount: rentalFields.totalPrice,
            status: 'PAID',
          },
        },
      },
    });

    if (review) {
      await prisma.review.create({
        data: {
          ...review,
          listingId: rental.listingId,
          rentalId: rental.id,
        },
      });
    }
  }

  console.log(`✅ Created ${completedRentals.length} completed rentals with reviews`);
  console.log('🎉 Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 6 (1 admin, 5 regular)`);
  console.log(`   - Listings: ${createdListings.length}`);
  console.log(`   - Rentals: ${completedRentals.length}`);
  console.log(`   - Reviews: ${completedRentals.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
