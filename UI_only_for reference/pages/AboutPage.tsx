import { Users, Shield, Zap, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl mb-6 text-center">About RentIt</h1>
        <p className="text-xl text-muted-foreground text-center mb-12">
          Building a sustainable future through sharing
        </p>

        <div className="bg-card border border-border rounded-2xl p-8 mb-12">
          <h2 className="mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            RentIt is on a mission to create a more sustainable and connected world by making it easy for people to share items they own with their community. We believe that through sharing, we can reduce waste, save money, and build stronger neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Community First</h3>
            <p className="text-muted-foreground">
              We're building a platform that puts people first, creating connections and trust within local communities.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="mb-2">Safety & Trust</h3>
            <p className="text-muted-foreground">
              Every rental is protected with comprehensive insurance and verified user profiles for peace of mind.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Easy to Use</h3>
            <p className="text-muted-foreground">
              Simple, intuitive design makes renting and listing items quick and hassle-free for everyone.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="mb-2">Sustainability</h3>
            <p className="text-muted-foreground">
              Sharing resources reduces waste and environmental impact, helping create a more sustainable future.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary via-primary/80 to-accent/20 rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4">Join Our Community</h2>
          <p className="text-lg mb-6 opacity-90">
            Over 50,000 users have already discovered the benefits of sharing
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl mb-2">50K+</div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            <div>
              <div className="text-4xl mb-2">10K+</div>
              <div className="text-sm opacity-80">Items Listed</div>
            </div>
            <div>
              <div className="text-4xl mb-2">100K+</div>
              <div className="text-sm opacity-80">Successful Rentals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
