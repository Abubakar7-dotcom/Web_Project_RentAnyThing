import { Link } from 'react-router-dom';
import { listings } from '../utils/mockData';
import { ArrowRight, Star, Shield, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Footer } from '../components/Footer';

export function LandingPage() {
  const featuredListings = listings.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-2xl font-bold">RentIt</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="px-6 py-2 text-foreground hover:text-accent transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="People shaking hands"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-secondary/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-7xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight">
            Rent Anything,<br />Anytime
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/80 mb-12 max-w-3xl mx-auto">
            Join thousands who are saving money and building community by sharing the things they own
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-10 py-5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 text-lg font-semibold"
            >
              Start Renting
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-10 py-5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-all hover:shadow-2xl hover:shadow-accent/30 hover:scale-105 text-lg font-semibold"
            >
              List Your Items
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Items Available</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Successful Rentals</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Featured Rentals</h2>
          <p className="text-xl text-muted-foreground">
            Discover the most popular items in your community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredListings.map((listing) => (
            <Link
              key={listing.id}
              to="/auth"
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium">{listing.title}</h3>
                  <span className="text-primary whitespace-nowrap ml-2 font-semibold">${listing.pricePerDay}/day</span>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                  {listing.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>{listing.rating}</span>
                  <span>({listing.reviewCount})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-card border border-border hover:border-accent rounded-lg transition-all hover:shadow-lg"
          >
            View All Items
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-b from-background to-card py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Why Choose RentIt?</h2>
            <p className="text-xl text-muted-foreground">
              The smarter way to access what you need, when you need it
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-card border border-border rounded-xl hover:border-accent transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Money</h3>
              <p className="text-muted-foreground">
                Pay only for what you use. No need to buy expensive items you'll rarely use.
              </p>
            </div>
            <div className="text-center p-8 bg-card border border-border rounded-xl hover:border-accent transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Community</h3>
              <p className="text-muted-foreground">
                Connect with neighbors and build trust through sharing resources.
              </p>
            </div>
            <div className="text-center p-8 bg-card border border-border rounded-xl hover:border-accent transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Protected Rentals</h3>
              <p className="text-muted-foreground">
                Every rental is covered by comprehensive insurance for your peace of mind.
              </p>
            </div>
            <div className="text-center p-8 bg-card border border-border rounded-xl hover:border-accent transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Income</h3>
              <p className="text-muted-foreground">
                Turn your unused items into a steady income stream effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Ready to Start Sharing?</h2>
          <p className="text-xl mb-10 opacity-95">
            Join our community today and discover the benefits of the sharing economy
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary hover:bg-white/90 rounded-lg transition-all hover:shadow-2xl hover:scale-105 text-lg font-semibold"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
