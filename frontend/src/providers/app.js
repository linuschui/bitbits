import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';

export const AppProvider = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <React.Suspense>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <QueryClientProvider client={queryClient}>
          <Router>{children}</Router>
        </QueryClientProvider>
      </LoadScript>
    </React.Suspense>
  );
};
