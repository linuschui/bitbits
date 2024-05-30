import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Home } from '../features/misc/routes/Home';
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
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
