import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Grid, TrendingUp, PlusCircle, Calendar, Info, Settings, Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

export function DashboardLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { items, removeItem, total, itemCount } = useCart();
  const { user } = useAuth();
  
  // Enable inactivity timer (30 min timeout)
  // Note: hasRememberMe is set to false for now - in production, you'd check the cookie max-age
  useInactivityTimer(!!user, false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: Grid, label: 'Categories', path: '/app/categories' },
    { icon: TrendingUp, label: 'Popular', path: '/app/popular' },
    { icon: PlusCircle, label: 'Rent Out', path: '/app/rent-out' },
    { icon: Calendar, label: 'My Rentals', path: '/app/rentals' },
    { icon: Info, label: 'About', path: '/app/about' },
    { icon: Settings, label: 'Settings', path: '/app/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <div
        className="fixed left-0 top-0 bottom-0 bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 ease-in-out"
        style={{ width: sidebarExpanded ? '240px' : '72px' }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold transition-opacity duration-200"
              style={{ opacity: sidebarExpanded ? 1 : 0 }}
            >
              RentIt
            </span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className="whitespace-nowrap transition-opacity duration-200 font-medium"
                    style={{ opacity: sidebarExpanded ? 1 : 0 }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="transition-all duration-300" style={{ marginLeft: sidebarExpanded ? '240px' : '72px' }}>
        <Outlet />
      </div>

      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border z-50 p-6 shadow-2xl animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {items.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.listing.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{item.listing.title}</h4>
                      <button
                        onClick={() => removeItem(item.listing.id)}
                        className="text-destructive hover:text-destructive/80 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-muted-foreground text-sm">${item.listing.pricePerDay}/day</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Total (per day)</span>
                  <span className="text-xl font-bold">${total}</span>
                </div>
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors font-medium">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
