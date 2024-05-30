import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

export const AppProvider = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <React.Suspense>
      <QueryClientProvider client={queryClient}>
        <Router>{children}</Router>
      </QueryClientProvider>
    </React.Suspense>
  );
};
