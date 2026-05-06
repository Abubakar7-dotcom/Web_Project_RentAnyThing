import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Flag, MessageCircle, Star } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getListing, type Listing } from '../services/listingService';
import { rentalService, type Rental } from '../services/rentalService';
import * as reviewService from '../services/reviewService';
import { calculateDays } from '../utils/calculateDays';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmittingRental, setIsSubmittingRental] = useState(false);
  const [rentalError, setRentalError] = useState<string | null>(null);
  const { addItem } = useCart();

  // Reviews and Q&A state
  const [reviews, setReviews] = useState<reviewService.Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [qas, setQAs] = useState<reviewService.QA[]>([]);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Review form state
  const [eligibleRental, setEligibleRental] = useState<Rental | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const fetchedListing = await getListing(id);
        setListing(fetchedListing);

        // Fetch reviews and Q&A
        const [reviewsData, qasData] = await Promise.all([
          reviewService.getReviews(id),
          reviewService.getQAs(id),
        ]);

        setReviews(reviewsData.reviews);
        setAverageRating(reviewsData.averageRating);
        setQAs(qasData);

        // Check if current user has a completed rental for this listing (eligible to review)
        if (user) {
          try {
            const userRentals = await rentalService.getRentals();
            const completed = userRentals.find(
              (r) =>
                r.listingId === id &&
                r.borrowerId === user.id &&
                r.status === 'COMPLETED'
            );
            if (completed) {
              // Check they haven't already reviewed this rental
              const alreadyReviewed = reviewsData.reviews.some(
                (rev) => rev.rentalId === completed.id
              );
              if (!alreadyReviewed) {
                setEligibleRental(completed);
              }
            }
          } catch {
            // Non-critical — ignore errors here
          }
        }
      } catch (err: any) {
        console.error('Error fetching listing:', err);
        if (err.response?.status === 404) {
          setError('Listing not found');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch listing');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {error === 'Listing not found' ? 'Product not found' : 'Error loading product'}
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link to="/app" className="text-accent hover:underline">
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80';

  const handleAddToCart = () => {
    addItem(listing);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !eligibleRental || reviewRating === 0) return;

    try {
      setIsSubmittingReview(true);
      const newReview = await reviewService.submitReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
        rentalId: eligibleRental.id,
      });
      setReviews((prev) => [newReview, ...prev]);
      setAverageRating((prev) => {
        const total = prev * reviews.length + reviewRating;
        return Math.round((total / (reviews.length + 1)) * 10) / 10;
      });
      setEligibleRental(null); // Hide form after submission
      setShowReviewForm(false);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {    e.preventDefault();
    if (!question.trim() || !id) return;

    try {
      setIsSubmittingQuestion(true);
      const newQA = await reviewService.submitQuestion(id, question.trim());
      setQAs([...qas, newQA]);
      setQuestion('');
    } catch (err: any) {
      console.error('Error submitting question:', err);
      alert(err.response?.data?.error || 'Failed to submit question');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleRentNow = () => {
    if (!user) {
      alert('Please log in to rent items');
      return;
    }
    setShowRentalForm(true);
    setRentalError(null);
  };

  const handleSubmitRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !startDate || !endDate) return;

    try {
      setIsSubmittingRental(true);
      setRentalError(null);

      await rentalService.createRental({
        listingId: id,
        startDate,
        endDate,
      });

      alert('Rental request submitted successfully! The owner will review your request.');
      setShowRentalForm(false);
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      console.error('Error creating rental:', err);
      setRentalError(err.response?.data?.error || 'Failed to submit rental request');
    } finally {
      setIsSubmittingRental(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !listing) return 0;
    try {
      const days = calculateDays(startDate, endDate);
      return listing.pricePerDay * days;
    } catch {
      return 0;
    }
  };

  const getDays = () => {
    if (!startDate || !endDate) return 0;
    try {
      return calculateDays(startDate, endDate);
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>
        <Link
          to={`/app/complaints?listingId=${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive border border-border hover:border-destructive rounded-lg transition-colors"
        >
          <Flag className="w-4 h-4" />
          Report Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="aspect-square rounded-2xl overflow-hidden border border-border">
          <img
            src={imageUrl}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
              <p className="text-muted-foreground">by {listing.owner.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-primary font-bold mb-1">${listing.pricePerDay}</div>
              <div className="text-muted-foreground">per day</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={averageRating} showCount count={reviews.length} />
          </div>

          <p className="text-lg mb-6">{listing.description}</p>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleRentNow}
              disabled={!listing.isAvailable}
              className="flex-1 px-6 py-4 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30 font-medium"
            >
              {listing.isAvailable ? 'Rent Now' : 'Not Available'}
            </button>
            <button 
              onClick={handleAddToCart}
              className="px-6 py-4 bg-card border border-border hover:border-accent rounded-lg transition-all font-medium"
            >
              Add to Cart
            </button>
            {user && user.id !== listing.ownerId && (
              <button
                onClick={() => navigate(`/app/chat?listingId=${id}&userId=${listing.owner.id}`)}
                className="px-6 py-4 bg-card border border-border hover:border-primary rounded-lg transition-all font-medium flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Message
              </button>
            )}
          </div>

          {/* Rental Form Modal */}
          {showRentalForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Rent {listing.title}</h3>
                
                {rentalError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {rentalError}
                  </div>
                )}

                <form onSubmit={handleSubmitRental} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {startDate && endDate && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>Duration:</span>
                        <span className="font-medium">{getDays()} days</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Price per day:</span>
                        <span className="font-medium">${listing.pricePerDay}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-2">
                        <span>Total:</span>
                        <span className="text-primary">${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRentalForm(false);
                        setRentalError(null);
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRental || !startDate || !endDate}
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      {isSubmittingRental ? 'Submitting...' : 'Confirm Rental'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
            {qas.map((qa) => (
              <div key={qa.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-accent font-bold">Q:</span>
                    <p>{qa.question}</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5">
                    by {qa.asker.name}
                  </p>
                </div>
                {qa.answer && (
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-primary font-bold">A:</span>
                      <p>{qa.answer}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-5">
                      by {qa.answeredBy || 'Owner'}
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
              disabled={isSubmittingQuestion}
              className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isSubmittingQuestion || !question.trim()}
              className="px-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>

          {/* Success toast */}
          {reviewSuccess && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
              ✓ Your review has been submitted successfully!
            </div>
          )}

          {/* Review form — only for eligible users */}
          {eligibleRental && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full mb-6 px-4 py-3 border-2 border-dashed border-accent text-accent hover:bg-accent/5 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              You rented this — leave a review!
            </button>
          )}

          {eligibleRental && showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-muted rounded-xl border border-border">
              <h3 className="font-semibold mb-3">Write Your Review</h3>

              {/* Star picker */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {reviewRating === 0 ? 'Select a rating' : `${reviewRating} / 5`}
                </span>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this item..."
                rows={3}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm mb-3"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview || reviewRating === 0 || !reviewComment.trim()}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          {/* Reviews list */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{review.reviewer.name}</h4>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
