import { useState } from 'react';
import { Link } from 'react-router';
import { products } from '../data/mockData';
import { Search, SlidersHorizontal, Star } from 'lucide-react';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen p-8">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-20 pb-6 -mt-8 pt-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>
          <button className="px-6 py-3 bg-card border border-border rounded-lg hover:border-accent transition-all flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="mb-6">Featured Items</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/app/product/${product.id}`}
              className="group flex-shrink-0 w-80 bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg">{product.name}</h3>
                  <span className="text-primary whitespace-nowrap ml-2">${product.price}/day</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span>{product.rating}</span>
                    <span>({product.reviews})</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/app/product/${product.id}`}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"
            >
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
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
