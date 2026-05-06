import { useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { useListings } from '../hooks/useListings';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Dashboard() {
  const { listings, isLoading, error, search, setSearch } = useListings();
  
  const featuredListings = useMemo(() => 
    listings.filter((p) => p.isFeatured),
    [listings]
  );

  const allListings = useMemo(() => listings, [listings]);

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
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-20 pb-6 -mt-8 pt-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>
          <button className="px-6 py-3 bg-card border border-border rounded-lg hover:border-accent transition-all flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Items</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {featuredListings.map((listing) => (
            <div key={listing.id} className="flex-shrink-0 w-80">
              <ListingCard listing={listing} variant="video" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">All Products</h2>
        {allListings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No items found matching "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
