export interface Listing {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  depositAmount: number;
  category: string;
  location: string;
  isAvailable: boolean;
  isFeatured: boolean;
  ownerId: string;
  ownerName: string;
  image: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Review {
  id: string;
  listingId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface QA {
  id: string;
  listingId: string;
  question: string;
  answer: string | null;
  askerName: string;
  answeredBy: string | null;
  createdAt: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Electronics', icon: '📱', count: 156 },
  { id: '2', name: 'Tools', icon: '🔧', count: 89 },
  { id: '3', name: 'Sports', icon: '⚽', count: 124 },
  { id: '4', name: 'Cameras', icon: '📷', count: 67 },
  { id: '5', name: 'Gaming', icon: '🎮', count: 93 },
  { id: '6', name: 'Music', icon: '🎸', count: 45 },
  { id: '7', name: 'Outdoor', icon: '⛺', count: 78 },
  { id: '8', name: 'Party', icon: '🎉', count: 112 },
];

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Sony A7 III Camera',
    description: 'Professional mirrorless camera with 24.2MP full-frame sensor. Perfect for photography and videography projects.',
    pricePerDay: 45,
    depositAmount: 500,
    category: 'Cameras',
    location: 'San Francisco, CA',
    isAvailable: true,
    isFeatured: true,
    ownerId: 'owner1',
    ownerName: 'PhotoPro Studio',
    image: 'https://images.unsplash.com/photo-1606980623785-92c5a7d7023c?w=500&q=80',
    rating: 4.8,
    reviewCount: 127,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'DJI Mavic Air 2 Drone',
    description: 'Advanced drone with 4K camera, 34-minute flight time, and intelligent tracking features.',
    pricePerDay: 35,
    depositAmount: 400,
    category: 'Cameras',
    location: 'Los Angeles, CA',
    isAvailable: true,
    isFeatured: true,
    ownerId: 'owner2',
    ownerName: 'SkyView Rentals',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80',
    rating: 4.9,
    reviewCount: 203,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: '3',
    title: 'Canon EF 70-200mm Lens',
    description: 'Professional telephoto zoom lens with f/2.8 aperture. Ideal for sports and wildlife photography.',
    pricePerDay: 30,
    depositAmount: 300,
    category: 'Cameras',
    location: 'Seattle, WA',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner3',
    ownerName: 'LensHub',
    image: 'https://images.unsplash.com/photo-1606980593107-69f6e89d49f5?w=500&q=80',
    rating: 4.7,
    reviewCount: 89,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: '4',
    title: 'MacBook Pro 16"',
    description: 'High-performance laptop with M2 Max chip, 32GB RAM, perfect for video editing and development.',
    pricePerDay: 55,
    depositAmount: 1000,
    category: 'Electronics',
    location: 'New York, NY',
    isAvailable: true,
    isFeatured: true,
    ownerId: 'owner4',
    ownerName: 'TechRent Pro',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    rating: 4.9,
    reviewCount: 312,
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: '5',
    title: 'PlayStation 5',
    description: 'Latest gaming console with 4K graphics and extensive game library. Includes two controllers.',
    pricePerDay: 25,
    depositAmount: 200,
    category: 'Gaming',
    location: 'Austin, TX',
    isAvailable: true,
    isFeatured: true,
    ownerId: 'owner5',
    ownerName: 'GameZone',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80',
    rating: 4.8,
    reviewCount: 456,
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: '6',
    title: 'Fender Stratocaster',
    description: 'Classic electric guitar with warm tone and smooth playability. Perfect for performances.',
    pricePerDay: 40,
    depositAmount: 350,
    category: 'Music',
    location: 'Nashville, TN',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner6',
    ownerName: 'SoundWave Music',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80',
    rating: 4.6,
    reviewCount: 78,
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: '7',
    title: 'GoPro Hero 11',
    description: 'Action camera with 5.3K video, waterproof design, and incredible stabilization.',
    pricePerDay: 20,
    depositAmount: 150,
    category: 'Cameras',
    location: 'Denver, CO',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner7',
    ownerName: 'AdventureGear',
    image: 'https://images.unsplash.com/photo-1585839001119-bd4c990fdec0?w=500&q=80',
    rating: 4.7,
    reviewCount: 234,
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: '8',
    title: 'Nord Stage 3 Keyboard',
    description: 'Professional stage piano with 88 weighted keys and premium sound engine.',
    pricePerDay: 60,
    depositAmount: 600,
    category: 'Music',
    location: 'Chicago, IL',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner8',
    ownerName: 'Piano Rentals Inc',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    rating: 4.9,
    reviewCount: 92,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: '9',
    title: 'Mountain Bike - Trek X-Caliber',
    description: 'High-performance mountain bike with 29" wheels and hydraulic disc brakes.',
    pricePerDay: 28,
    depositAmount: 250,
    category: 'Sports',
    location: 'Portland, OR',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner9',
    ownerName: 'BikeShare Plus',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&q=80',
    rating: 4.5,
    reviewCount: 167,
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: '10',
    title: 'Camping Tent - 6 Person',
    description: 'Spacious weatherproof tent with easy setup. Perfect for family camping trips.',
    pricePerDay: 22,
    depositAmount: 100,
    category: 'Outdoor',
    location: 'Boulder, CO',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner10',
    ownerName: 'OutdoorLife',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&q=80',
    rating: 4.4,
    reviewCount: 145,
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: '11',
    title: 'Professional DJ Controller',
    description: '4-channel DJ controller with premium jog wheels and mixer controls.',
    pricePerDay: 38,
    depositAmount: 300,
    category: 'Music',
    location: 'Miami, FL',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner11',
    ownerName: 'DJ Equipment Hub',
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=500&q=80',
    rating: 4.7,
    reviewCount: 156,
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: '12',
    title: 'Nintendo Switch OLED',
    description: 'Portable gaming console with vibrant OLED screen and extensive game library.',
    pricePerDay: 18,
    depositAmount: 120,
    category: 'Gaming',
    location: 'Boston, MA',
    isAvailable: true,
    isFeatured: false,
    ownerId: 'owner12',
    ownerName: 'Console Rentals',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80',
    rating: 4.6,
    reviewCount: 289,
    createdAt: '2026-03-20T10:00:00Z',
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    listingId: '1',
    reviewerName: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing camera! The image quality is outstanding and it was in perfect condition. Renting was super easy.',
    createdAt: '2026-04-15T10:00:00Z',
  },
  {
    id: '2',
    listingId: '1',
    reviewerName: 'Michael Chen',
    rating: 5,
    comment: 'Perfect for my wedding shoot. The owner was very helpful with setup instructions.',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: '3',
    listingId: '1',
    reviewerName: 'Emma Davis',
    rating: 4,
    comment: 'Great camera, slight delay in pickup but overall excellent experience.',
    createdAt: '2026-04-05T10:00:00Z',
  },
];

export const qas: QA[] = [
  {
    id: '1',
    listingId: '1',
    question: 'Does this come with extra batteries?',
    answer: 'Yes! I include 2 extra batteries and a charger with every rental.',
    askerName: 'John D.',
    answeredBy: 'PhotoPro Studio',
    createdAt: '2026-04-20T10:00:00Z',
  },
  {
    id: '2',
    listingId: '1',
    question: 'Can I rent this for a full week?',
    answer: 'Absolutely! Weekly rentals get a 15% discount. Just select the dates in checkout.',
    askerName: 'Lisa M.',
    answeredBy: 'PhotoPro Studio',
    createdAt: '2026-04-18T10:00:00Z',
  },
  {
    id: '3',
    listingId: '1',
    question: 'Is there a lens included?',
    answer: 'Yes, it comes with a 28-70mm kit lens. I also have other lenses available for rent.',
    askerName: 'Tom R.',
    answeredBy: 'PhotoPro Studio',
    createdAt: '2026-04-12T10:00:00Z',
  },
];
