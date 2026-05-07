import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  console.log('[ProtectedRoute] isLoading:', isLoading, 'user:', user ? 'exists' : 'none');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('[ProtectedRoute] User authenticated, rendering children');
  return <>{children}</>;
}
