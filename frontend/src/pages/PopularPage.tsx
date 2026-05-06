import { useState, useEffect, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { getListings, type Listing } from '../services/listingService';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function PopularPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopularListings() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all listings to sort by review count
        const result = await getListings({ limit: 1000 });
        setListings(result.listings);
      } catch (err: any) {
        console.error('Error fetching popular listings:', err);
        setError(err.response?.data?.error || 'Failed to fetch popular listings');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularListings();
  }, []);

  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      const aReviewCount = a.reviews?.length || 0;
      const bReviewCount = b.reviews?.length || 0;
      return bReviewCount - aReviewCount;
    });
  }, [listings]);

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
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-10 h-10 text-accent" />
        <h1 className="text-4xl font-bold">Popular Items</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedListings.map((listing, index) => (
          <ListingCard 
            key={listing.id} 
            listing={listing} 
            rank={index < 3 ? index + 1 : undefined}
          />
        ))}
      </div>
    </div>
  );
}
