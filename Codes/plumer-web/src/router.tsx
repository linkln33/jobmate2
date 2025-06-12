import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/auth/Login';
import BusinessInfo from './pages/admin/BusinessInfo';
import Services from './pages/admin/Services';
import Bookings from './pages/admin/Bookings';
import Gallery from './pages/admin/Gallery';
import Calendar from './pages/admin/Calendar';
import Settings from './pages/admin/Settings';
import TestPage from './pages/admin/TestPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  // Direct routes to admin pages (bypass authentication for testing)
  {
    path: '/admin-test',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'business-info',
        element: <BusinessInfo />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'bookings',
        element: <Bookings />,
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  
  // Protected admin routes
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'business-info',
            element: <BusinessInfo />,
          },
          {
            path: 'services',
            element: <Services />,
          },
          {
            path: 'bookings',
            element: <Bookings />,
          },
          {
            path: 'gallery',
            element: <Gallery />,
          },
          {
            path: 'calendar',
            element: <Calendar />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'test',
            element: <TestPage />,
          },
        ],
      },
    ],
  },
  
  // Catch all route - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
