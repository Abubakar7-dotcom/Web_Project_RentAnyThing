import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { ChatWidget } from './components/ChatWidget';
import { useInactivityTimer } from './hooks/useInactivityTimer';

// Public pages (not lazy loaded)
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

// Lazy loaded pages
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const PopularPage = lazy(() => import('./pages/PopularPage').then(m => ({ default: m.PopularPage })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const RentOutPage = lazy(() => import('./pages/RentOutPage').then(m => ({ default: m.RentOutPage })));
const RentalsPage = lazy(() => import('./pages/RentalsPage').then(m => ({ default: m.RentalsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./pages/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminComplaints = lazy(() => import('./pages/AdminComplaints').then(m => ({ default: m.AdminComplaints })));

// Inner component that uses the auth context and inactivity timer
function AppRoutes() {
  const { user, hasRememberMe } = useAuth();
  
  // Enable inactivity timer when user is authenticated and doesn't have remember me
  useInactivityTimer(!!user, hasRememberMe);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected app routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardLayout />
              <ChatWidget />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>} />
        <Route path="categories" element={<Suspense fallback={<LoadingSpinner />}><CategoriesPage /></Suspense>} />
        <Route path="popular" element={<Suspense fallback={<LoadingSpinner />}><PopularPage /></Suspense>} />
        <Route path="product/:id" element={<Suspense fallback={<LoadingSpinner />}><ProductDetail /></Suspense>} />
        <Route path="rent-out" element={<Suspense fallback={<LoadingSpinner />}><RentOutPage /></Suspense>} />
        <Route path="rentals" element={<Suspense fallback={<LoadingSpinner />}><RentalsPage /></Suspense>} />
        <Route path="about" element={<Suspense fallback={<LoadingSpinner />}><AboutPage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<LoadingSpinner />}><SettingsPage /></Suspense>} />
        <Route path="chat" element={<Suspense fallback={<LoadingSpinner />}><ChatPage /></Suspense>} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardLayout />
            </Suspense>
          </AdminRoute>
        }
      >
        <Route index element={<Suspense fallback={<LoadingSpinner />}><AdminDashboard /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<LoadingSpinner />}><AdminUsers /></Suspense>} />
        <Route path="complaints" element={<Suspense fallback={<LoadingSpinner />}><AdminComplaints /></Suspense>} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
