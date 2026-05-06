import { useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ListingCard } from '../components/ListingCard';
import { useListings } from '../hooks/useListings';
import { LoadingSpinner } from '../components/LoadingSpinner';

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

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFilter = searchParams.get('category') || '';

  const { listings, isLoading, error, search, setSearch } = useListings(
    categoryFilter ? { category: categoryFilter } : {}
  );

  const featuredListings = useMemo(
    () => listings.filter((p) => p.isFeatured),
    [listings]
  );

  const clearCategory = () => {
    navigate('/app', { replace: true });
  };

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

  const categoryIcon = categoryDefinitions.find((c) => c.name === categoryFilter)?.icon;

  return (
    <div className="min-h-screen p-8">
      {/* Sticky search bar */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-20 pb-6 -mt-8 pt-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={categoryFilter ? `Search in ${categoryFilter}...` : 'Search for items...'}
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

        {/* Active category filter badge */}
        {categoryFilter && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
              {categoryIcon} {categoryFilter}
              <button
                onClick={clearCategory}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Featured Items — only show when no category filter */}
      {!categoryFilter && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Items</h2>
          {featuredListings.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {featuredListings.map((listing) => (
                <div key={listing.id} className="flex-shrink-0 w-80">
                  <ListingCard listing={listing} variant="video" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No featured items yet.</p>
          )}
        </div>
      )}

      {/* All Products / Category results */}
      <div>
        <h2 className="text-3xl font-bold mb-6">
          {categoryFilter ? `${categoryIcon} ${categoryFilter}` : 'All Products'}
        </h2>
        {listings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {search
              ? <p>No items found matching "{search}"</p>
              : categoryFilter
              ? <p>No items listed in {categoryFilter} yet.</p>
              : <p>No items available yet.</p>
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
