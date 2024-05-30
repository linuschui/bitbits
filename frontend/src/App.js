import React from 'react';
import './App.css';
import { AppRoutes } from './routes';
import { AppProvider } from './providers/app';

const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
