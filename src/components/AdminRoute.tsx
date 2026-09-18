import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RouteSpinner } from './ProtectedRoute';

/**
 * Requires a signed-in user whose uid is listed in the `admins` collection.
 * Anonymous users go to /auth, signed-in non-admins go home.
 */
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin, adminLoading, ensureAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    void ensureAuth();
  }, [ensureAuth]);

  if (loading || adminLoading) return <RouteSpinner />;

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
