import { useParams, Link } from 'react-router';
import { products, reviews, qas } from '../data/mockData';
import { ArrowLeft, Star, Send } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const productReviews = reviews.filter((r) => r.productId === id);
  const productQAs = qas.filter((q) => q.productId === id);

  if (!product) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Product not found</h2>
          <Link to="/app" className="text-accent hover:underline">
                Go back to dashboard
              </Link>
        </div>
      </div>
    );
  }

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
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl mb-2">{product.name}</h1>
              <p className="text-muted-foreground">by {product.owner}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-primary mb-1">${product.price}</div>
              <div className="text-muted-foreground">per day</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <p className="text-lg mb-6">{product.description}</p>

          <div className="flex gap-4 mb-6">
            <button className="flex-1 px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30">
              Rent Now
            </button>
            <button className="px-6 py-4 bg-card border border-border hover:border-accent rounded-lg transition-all">
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6 bg-card border border-border rounded-xl">
            <div>
              <div className="text-muted-foreground text-sm mb-1">Category</div>
              <div>{product.category}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-1">Availability</div>
              <div className="text-accent">Available Now</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-1">Min Rental</div>
              <div>1 day</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-1">Location</div>
              <div>San Francisco, CA</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="mb-6">Questions & Answers</h2>
          <div className="space-y-6 mb-6">
            {productQAs.map((qa) => (
              <div key={qa.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-accent">Q:</span>
                    <p>{qa.question}</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5">
                    by {qa.askedBy} • {qa.date}
                  </p>
                </div>
                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-primary">A:</span>
                    <p>{qa.answer}</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5">
                    by {qa.answeredBy} • {qa.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <button className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="mb-6">Reviews</h2>
          <div className="space-y-6">
            {productReviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-base">{review.user}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
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
