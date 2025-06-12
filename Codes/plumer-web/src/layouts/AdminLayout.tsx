import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Check if we're in development mode and using the test route
  const isDevelopmentTest = location.pathname.includes('/admin-test');
  
  // Navigation items - use test routes if we're in the test mode
  const navItems = [
    { 
      path: isDevelopmentTest ? '/admin-test' : '/admin', 
      label: 'Dashboard', 
      icon: 'chart-bar' 
    },
    { 
      path: isDevelopmentTest ? '/admin-test/business-info' : '/admin/business-info', 
      label: 'Business Info', 
      icon: 'building-office' 
    },
    { 
      path: isDevelopmentTest ? '/admin-test/services' : '/admin/services', 
      label: 'Services', 
      icon: 'wrench' 
    },
    { 
      path: isDevelopmentTest ? '/admin-test/bookings' : '/admin/bookings', 
      label: 'Bookings', 
      icon: 'calendar' 
    },
    { 
      path: isDevelopmentTest ? '/admin-test/gallery' : '/admin/gallery', 
      label: 'Gallery', 
      icon: 'photo' 
    },
    { 
      path: isDevelopmentTest ? '/admin-test/calendar' : '/admin/calendar', 
      label: 'Calendar', 
      icon: 'clock' 
    },
    { 
      path: isDevelopmentTest ? '/admin-test/settings' : '/admin/settings', 
      label: 'Settings', 
      icon: 'cog' 
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold">Plumer Pro</Link>
          <div className="text-sm opacity-75">Admin Dashboard</div>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 hover:bg-primary-dark transition-colors ${
                    location.pathname === item.path ? 'bg-primary-dark' : ''
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={getIconPath(item.icon)}
                    />
                  </svg>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">Admin</div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Helper function to get SVG path for icons
function getIconPath(icon: string): string {
  switch (icon) {
    case 'chart-bar':
      return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
    case 'building-office':
      return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
    case 'wrench':
      return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
    case 'calendar':
      return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
    case 'photo':
      return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    case 'clock':
      return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'cog':
      return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
    default:
      return '';
  }
}

export default AdminLayout;
