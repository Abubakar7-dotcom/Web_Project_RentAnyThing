import { useState } from 'react';
import { User, Lock, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  });

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="max-w-4xl space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium">
              Update Password
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive updates about your rentals via email</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-accent"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">Receive text messages for important updates</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsNotifications}
                onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-accent"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Marketing Emails</div>
                <div className="text-sm text-muted-foreground">Receive promotional offers and news</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketingEmails}
                onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-accent"
              />
            </label>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Payment Methods</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/25</div>
                </div>
              </div>
              <button className="text-destructive hover:text-destructive/80 text-sm font-medium">
                Remove
              </button>
            </div>
            <button className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors text-muted-foreground hover:text-accent font-medium">
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
