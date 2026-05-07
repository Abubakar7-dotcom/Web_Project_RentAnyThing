import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListings } from '../services/listingService';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Category {
  name: string;
  icon: string;
  image: string;
  count: number;
}

// Static category definitions with icons and images
const categoryDefinitions = [
  { 
    name: 'Electronics', 
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
  },
  { 
    name: 'Tools', 
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop'
  },
  { 
    name: 'Sports', 
    icon: '⚽',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop'
  },
  { 
    name: 'Photography', 
    icon: '📷',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop'
  },
  { 
    name: 'Camping', 
    icon: '⛺',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'
  },
  { 
    name: 'Music', 
    icon: '🎸',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop'
  },
  { 
    name: 'Party', 
    icon: '🎉',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'
  },
  { 
    name: 'Vehicles', 
    icon: '🚗',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'
  },
];

export function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all listings to calculate category counts
        const result = await getListings({ limit: 1000 }); // Get a large number to count all
        const listings = result.listings;
        
        // Count listings by category
        const categoryCounts: Record<string, number> = {};
        listings.forEach((listing: any) => {
          categoryCounts[listing.category] = (categoryCounts[listing.category] || 0) + 1;
        });
        
        // Combine with category definitions
        const categoriesWithCounts = categoryDefinitions.map(def => ({
          ...def,
          count: categoryCounts[def.name] || 0,
        }));
        
        setCategories(categoriesWithCounts);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.error || 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategoryCounts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Browse by Category</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => navigate(`/app?category=${encodeURIComponent(category.name)}`)}
            className="group relative overflow-hidden bg-card border border-border rounded-xl hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Background Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Icon Overlay */}
              <div className="absolute top-4 right-4 text-4xl group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 text-left">
              <h3 className="text-xl font-semibold mb-2 text-foreground">{category.name}</h3>
              <p className="text-muted-foreground">{category.count} items available</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
