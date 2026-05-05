import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando sesión...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
