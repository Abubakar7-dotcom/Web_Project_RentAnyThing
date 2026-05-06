import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listings, reviews, qas } from '../utils/mockData';
import { ArrowLeft, Send } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const listing = listings.find((p) => p.id === id);
  const listingReviews = reviews.filter((r) => r.listingId === id);
  const listingQAs = qas.filter((q) => q.listingId === id);
  const [question, setQuestion] = useState('');
  const { addItem } = useCart();

  if (!listing) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product not found</h2>
          <Link to="/app" className="text-accent hover:underline">
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(listing);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // Mock submission
      alert('Question submitted!');
      setQuestion('');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Link
        to="/app"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="aspect-square rounded-2xl overflow-hidden border border-border">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
              <p className="text-muted-foreground">by {listing.ownerName}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-primary font-bold mb-1">${listing.pricePerDay}</div>
              <div className="text-muted-foreground">per day</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={listing.rating} showCount count={listing.reviewCount} />
          </div>

          <p className="text-lg mb-6">{listing.description}</p>

          <div className="flex gap-4 mb-6">
            <button className="flex-1 px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30 font-medium">
              Rent Now
            </button>
            <button 
              onClick={handleAddToCart}
              className="px-6 py-4 bg-card border border-border hover:border-accent rounded-lg transition-all font-medium"
            >
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6 bg-card border border-border rounded-xl">
            <div>
              <div className="text-muted-foreground text-sm mb-1">Category</div>
              <div className="font-medium">{listing.category}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-1">Availability</div>
              <div className={listing.isAvailable ? 'text-accent font-medium' : 'text-destructive font-medium'}>
                {listing.isAvailable ? 'Available Now' : 'Not Available'}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-1">Min Rental</div>
              <div className="font-medium">1 day</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-1">Location</div>
              <div className="font-medium">{listing.location}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Questions & Answers</h2>
          <div className="space-y-6 mb-6">
            {listingQAs.map((qa) => (
              <div key={qa.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-accent font-bold">Q:</span>
                    <p>{qa.question}</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5">
                    by {qa.askerName}
                  </p>
                </div>
                {qa.answer && (
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-primary font-bold">A:</span>
                      <p>{qa.answer}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-5">
                      by {qa.answeredBy}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmitQuestion} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <button 
              type="submit"
              className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="space-y-6">
            {listingReviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.reviewerName}</h4>
                    <div className="mt-1">
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
