import { Bell, User, Lock, CreditCard, Shield } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl mb-8">Settings</h1>

      <div className="max-w-4xl space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-accent" />
            <h2>Profile Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Phone</label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-accent" />
            <h2>Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
              Update Password
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent" />
            <h2>Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-input rounded-lg cursor-pointer">
              <div>
                <div className="mb-1">Email Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive updates about your rentals
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded accent-accent"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-input rounded-lg cursor-pointer">
              <div>
                <div className="mb-1">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Get text alerts for important updates
                </div>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 rounded accent-accent"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-input rounded-lg cursor-pointer">
              <div>
                <div className="mb-1">Marketing Emails</div>
                <div className="text-sm text-muted-foreground">
                  Receive promotional offers and news
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded accent-accent"
              />
            </label>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-accent" />
            <h2>Payment Methods</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-input rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-primary to-accent rounded flex items-center justify-center text-xs text-white">
                  VISA
                </div>
                <div>
                  <div>•••• •••• •••• 4532</div>
                  <div className="text-sm text-muted-foreground">Expires 12/26</div>
                </div>
              </div>
              <button className="text-accent hover:underline text-sm">Remove</button>
            </div>
            <button className="w-full py-3 border-2 border-dashed border-border hover:border-accent rounded-lg transition-colors text-muted-foreground hover:text-accent">
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
