import { useMemo } from 'react';
import { listings } from '../utils/mockData';
import { TrendingUp } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';

export function PopularPage() {
  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => b.reviewCount - a.reviewCount);
  }, []);

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
