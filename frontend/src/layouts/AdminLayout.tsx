import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, AlertCircle, ArrowLeft } from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: AlertCircle, label: 'Complaints', path: '/admin/complaints' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/app"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to App
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
