import { Link } from 'react-router-dom';
import type { Listing } from '../utils/mockData';
import { StarRating } from './StarRating';

interface ListingCardProps {
  listing: Listing;
  rank?: number;
  variant?: 'square' | 'video';
}

export function ListingCard({ listing, rank, variant = 'square' }: ListingCardProps) {
  const aspectClass = variant === 'video' ? 'aspect-video' : 'aspect-square';

  return (
    <Link
      to={`/app/product/${listing.id}`}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
    >
      {rank && rank <= 3 && (
        <div className="absolute top-3 left-3 z-10 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold shadow-lg">
          #{rank}
        </div>
      )}
      <div className={`${aspectClass} overflow-hidden`}>
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium">{listing.title}</h3>
          <span className="text-primary whitespace-nowrap ml-2 font-semibold">
            ${listing.pricePerDay}/day
          </span>
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {listing.description}
        </p>
        <div className="flex items-center justify-between">
          <StarRating rating={listing.rating} size="sm" showCount count={listing.reviewCount} />
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {listing.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
