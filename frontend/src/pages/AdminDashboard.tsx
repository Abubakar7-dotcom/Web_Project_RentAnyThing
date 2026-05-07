import { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign, AlertCircle, Activity } from 'lucide-react';
import { getDashboardStats, type DashboardStats } from '../services/adminService';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.error || 'Failed to fetch dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={fetchStats} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Total Listings', 
      value: stats.totalListings.toLocaleString(), 
      icon: Package, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Active Rentals', 
      value: stats.activeRentals.toLocaleString(), 
      icon: Activity, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Total Rentals', 
      value: stats.totalRentals.toLocaleString(), 
      icon: TrendingUp, 
      color: 'bg-indigo-500' 
    },
    { 
      label: 'Pending Complaints', 
      value: stats.pendingComplaints.toLocaleString(), 
      icon: AlertCircle, 
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
