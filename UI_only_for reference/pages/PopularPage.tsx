import { Link } from 'react-router';
import { products } from '../data/mockData';
import { Star, TrendingUp } from 'lucide-react';

export function PopularPage() {
  const popularProducts = [...products].sort((a, b) => b.reviews - a.reviews);

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-accent" />
        <h1 className="text-4xl">Most Popular Rentals</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {popularProducts.map((product, index) => (
          <Link
            key={product.id}
            to={`/app/product/${product.id}`}
            className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"
          >
            {index < 3 && (
              <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-accent text-background rounded-full text-sm">
                #{index + 1}
              </div>
            )}
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base">{product.name}</h4>
                <span className="text-primary text-sm whitespace-nowrap ml-2">${product.price}/day</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-accent">{product.reviews} rentals</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
