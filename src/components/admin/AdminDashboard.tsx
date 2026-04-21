import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToursCrud from './ToursCrud';

const queryClient = new QueryClient();

export default function AdminDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToursCrud />
    </QueryClientProvider>
  );
}
