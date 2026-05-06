import { Users, Shield, Zap, Leaf } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About RentIt</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building a sustainable future through community-driven sharing
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            RentIt was founded on the belief that access is better than ownership. We're creating a world where
            communities thrive by sharing resources, reducing waste, and building meaningful connections. Our platform
            empowers individuals to monetize their unused items while providing affordable access to quality products
            for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Community First</h3>
            <p className="text-muted-foreground">
              We believe in the power of community. Every transaction on RentIt strengthens local connections and
              builds trust between neighbors.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Safety & Trust</h3>
            <p className="text-muted-foreground">
              Your security is our priority. Every rental is protected, every user is verified, and our support team
              is always here to help.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Easy to Use</h3>
            <p className="text-muted-foreground">
              Renting should be simple. Our intuitive platform makes it easy to list items, find what you need, and
              complete transactions seamlessly.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Sustainability</h3>
            <p className="text-muted-foreground">
              By sharing instead of buying, we reduce waste and environmental impact. Together, we're building a more
              sustainable future.
            </p>
          </div>
        </div>

        <div className="relative py-16 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent" />
          <div className="relative z-10 text-center text-white px-8">
            <h2 className="text-4xl font-bold mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold mb-2">50K+</div>
                <div className="text-xl opacity-90">Active Users</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">10K+</div>
                <div className="text-xl opacity-90">Items Listed</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100K+</div>
                <div className="text-xl opacity-90">Successful Rentals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
