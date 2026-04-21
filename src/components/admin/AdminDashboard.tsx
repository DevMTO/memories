import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToursCrud from './ToursCrud';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

const queryClient = new QueryClient();

export default function AdminDashboard() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <QueryClientProvider client={queryClient}>
          <ToursCrud />
        </QueryClientProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
}
