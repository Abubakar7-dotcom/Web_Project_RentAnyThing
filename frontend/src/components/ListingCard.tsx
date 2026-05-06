import { Link } from 'react-router-dom';
import type { Listing } from '../services/listingService';
import { StarRating } from './StarRating';

interface ListingCardProps {
  listing: Listing;
  rank?: number;
  variant?: 'square' | 'video';
}

export function ListingCard({ listing, rank, variant = 'square' }: ListingCardProps) {
  const aspectClass = variant === 'video' ? 'aspect-video' : 'aspect-square';
  
  // Calculate rating and review count from reviews array
  const reviews = listing.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const reviewCount = reviews.length;
  
  // Get the first image from media array
  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80'; // fallback image

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
          src={imageUrl}
          alt={listing.title}
          loading="lazy"
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
          <StarRating rating={averageRating} size="sm" showCount count={reviewCount} />
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {listing.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
