export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  owner: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface QA {
  id: string;
  productId: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  date: string;
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

export const products: Product[] = [
  {
    id: '1',
    name: 'Sony A7 III Camera',
    description: 'Professional mirrorless camera with 24.2MP full-frame sensor. Perfect for photography and videography projects.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1606980623785-92c5a7d7023c?w=500&q=80',
    category: 'Cameras',
    rating: 4.8,
    reviews: 127,
    owner: 'PhotoPro Studio',
    featured: true,
  },
  {
    id: '2',
    name: 'DJI Mavic Air 2 Drone',
    description: 'Advanced drone with 4K camera, 34-minute flight time, and intelligent tracking features.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80',
    category: 'Cameras',
    rating: 4.9,
    reviews: 203,
    owner: 'SkyView Rentals',
    featured: true,
  },
  {
    id: '3',
    name: 'Canon EF 70-200mm Lens',
    description: 'Professional telephoto zoom lens with f/2.8 aperture. Ideal for sports and wildlife photography.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1606980593107-69f6e89d49f5?w=500&q=80',
    category: 'Cameras',
    rating: 4.7,
    reviews: 89,
    owner: 'LensHub',
  },
  {
    id: '4',
    name: 'MacBook Pro 16"',
    description: 'High-performance laptop with M2 Max chip, 32GB RAM, perfect for video editing and development.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    category: 'Electronics',
    rating: 4.9,
    reviews: 312,
    owner: 'TechRent Pro',
    featured: true,
  },
  {
    id: '5',
    name: 'PlayStation 5',
    description: 'Latest gaming console with 4K graphics and extensive game library. Includes two controllers.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80',
    category: 'Gaming',
    rating: 4.8,
    reviews: 456,
    owner: 'GameZone',
    featured: true,
  },
  {
    id: '6',
    name: 'Fender Stratocaster',
    description: 'Classic electric guitar with warm tone and smooth playability. Perfect for performances.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80',
    category: 'Music',
    rating: 4.6,
    reviews: 78,
    owner: 'SoundWave Music',
  },
  {
    id: '7',
    name: 'GoPro Hero 11',
    description: 'Action camera with 5.3K video, waterproof design, and incredible stabilization.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1585839001119-bd4c990fdec0?w=500&q=80',
    category: 'Cameras',
    rating: 4.7,
    reviews: 234,
    owner: 'AdventureGear',
  },
  {
    id: '8',
    name: 'Nord Stage 3 Keyboard',
    description: 'Professional stage piano with 88 weighted keys and premium sound engine.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    category: 'Music',
    rating: 4.9,
    reviews: 92,
    owner: 'Piano Rentals Inc',
  },
  {
    id: '9',
    name: 'Mountain Bike - Trek X-Caliber',
    description: 'High-performance mountain bike with 29" wheels and hydraulic disc brakes.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&q=80',
    category: 'Sports',
    rating: 4.5,
    reviews: 167,
    owner: 'BikeShare Plus',
  },
  {
    id: '10',
    name: 'Camping Tent - 6 Person',
    description: 'Spacious weatherproof tent with easy setup. Perfect for family camping trips.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&q=80',
    category: 'Outdoor',
    rating: 4.4,
    reviews: 145,
    owner: 'OutdoorLife',
  },
  {
    id: '11',
    name: 'Professional DJ Controller',
    description: '4-channel DJ controller with premium jog wheels and mixer controls.',
    price: 38,
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=500&q=80',
    category: 'Music',
    rating: 4.7,
    reviews: 156,
    owner: 'DJ Equipment Hub',
  },
  {
    id: '12',
    name: 'Nintendo Switch OLED',
    description: 'Portable gaming console with vibrant OLED screen and extensive game library.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80',
    category: 'Gaming',
    rating: 4.6,
    reviews: 289,
    owner: 'Console Rentals',
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    user: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing camera! The image quality is outstanding and it was in perfect condition. Renting was super easy.',
    date: '2026-04-15',
  },
  {
    id: '2',
    productId: '1',
    user: 'Michael Chen',
    rating: 5,
    comment: 'Perfect for my wedding shoot. The owner was very helpful with setup instructions.',
    date: '2026-04-10',
  },
  {
    id: '3',
    productId: '1',
    user: 'Emma Davis',
    rating: 4,
    comment: 'Great camera, slight delay in pickup but overall excellent experience.',
    date: '2026-04-05',
  },
];

export const qas: QA[] = [
  {
    id: '1',
    productId: '1',
    question: 'Does this come with extra batteries?',
    answer: 'Yes! I include 2 extra batteries and a charger with every rental.',
    askedBy: 'John D.',
    answeredBy: 'PhotoPro Studio',
    date: '2026-04-20',
  },
  {
    id: '2',
    productId: '1',
    question: 'Can I rent this for a full week?',
    answer: 'Absolutely! Weekly rentals get a 15% discount. Just select the dates in checkout.',
    askedBy: 'Lisa M.',
    answeredBy: 'PhotoPro Studio',
    date: '2026-04-18',
  },
  {
    id: '3',
    productId: '1',
    question: 'Is there a lens included?',
    answer: 'Yes, it comes with a 28-70mm kit lens. I also have other lenses available for rent.',
    askedBy: 'Tom R.',
    answeredBy: 'PhotoPro Studio',
    date: '2026-04-12',
  },
];
