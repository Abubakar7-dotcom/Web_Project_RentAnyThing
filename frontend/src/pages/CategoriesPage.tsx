import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListings } from '../services/listingService';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Category {
  name: string;
  icon: string;
  count: number;
}

// Static category definitions with icons
const categoryDefinitions = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Tools', icon: '🔧' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Cameras', icon: '📷' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Music', icon: '🎸' },
  { name: 'Outdoor', icon: '⛺' },
  { name: 'Party', icon: '🎉' },
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
            className="group p-8 bg-card border border-border rounded-xl hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-muted-foreground">{category.count} items</p>
          </button>
        ))}
      </div>
    </div>
  );
}
