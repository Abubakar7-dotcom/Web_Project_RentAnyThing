import { Users, Package, TrendingUp, DollarSign } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '50,234', icon: Users, color: 'primary' },
    { label: 'Active Listings', value: '10,456', icon: Package, color: 'accent' },
    { label: 'Total Rentals', value: '102,891', icon: TrendingUp, color: 'primary' },
    { label: 'Total Revenue', value: '$1,245,678', icon: DollarSign, color: 'accent' },
  ];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
              <div className={`w-12 h-12 bg-${stat.color}/10 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
