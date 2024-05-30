import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Home } from '../features/routes/Home';
import { Patrol } from '../features/routes/Patrol';
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  );
};

export const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'patrol', element: <Patrol /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
