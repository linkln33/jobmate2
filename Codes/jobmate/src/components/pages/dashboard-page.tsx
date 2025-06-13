"use client";

import { useState, useEffect, createContext } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, MapPin, Calendar, BarChart } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Badge } from '@/components/ui/badge';

// Define the type for the dashboard context
type DashboardContextType = {
  user: any;
} | null;

// Create a context to pass user data to dashboard components
export const DashboardContext = createContext<DashboardContextType>(null);

export function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [localLoading, setLocalLoading] = useState(true);
  
  // Debug logs
  useEffect(() => {
    console.log('Dashboard Page - Auth State:', { isAuthenticated, isLoading, user });
  }, [isAuthenticated, isLoading, user]);
  
  useEffect(() => {
    // Give the auth context a moment to initialize
    const timer = setTimeout(() => {
      setLocalLoading(false);
      
      if (!isLoading && !isAuthenticated) {
        console.log('Redirecting to login page');
        router.push('/login');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || localLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner className="h-12 w-12 text-brand-500" />
        <p className="mt-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }
  
  // Create mock user data if needed for development
  const mockUser = user || {
    id: 'mock-id',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    role: 'CUSTOMER',
    profileImageUrl: ''
  };
  
  // Dynamically import the appropriate dashboard based on user role
  const CustomerDashboard = dynamic(() => import('@/components/dashboard/customer-dashboard').then(mod => mod.CustomerDashboard), {
    loading: () => <div className="py-4"><Spinner className="h-8 w-8 text-brand-500" /></div>,
    ssr: false
  });

  const SpecialistDashboard = dynamic(() => import('@/components/dashboard/specialist-dashboard').then(mod => mod.SpecialistDashboard), {
    loading: () => <div className="py-4"><Spinner className="h-8 w-8 text-brand-500" /></div>,
    ssr: false
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 md:ml-64">
        {/* Mobile Navigation */}
        <MobileNav />
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm gap-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {mockUser.role === 'SPECIALIST' && (
              <div className="flex items-center mr-0 md:mr-4 w-full md:w-auto">
                <Badge variant={"outline"} className="flex items-center gap-1 px-3 py-1 w-full md:w-auto justify-center md:justify-start">
                  Status: <span className="text-red-500 font-medium">🔴 Not On Duty</span>
                </Badge>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full md:w-auto">
              <Bell className="h-4 w-4 mr-2" />
              <span>Notifications</span>
            </Button>
          </div>
        </div>
        
        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Jobs</p>
              <p className="text-xl font-bold">{mockUser.role === 'CUSTOMER' ? '2' : '5'}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
              <BarChart className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mockUser.role === 'CUSTOMER' ? 'Total Bookings' : 'Earnings'}</p>
              <p className="text-xl font-bold">{mockUser.role === 'CUSTOMER' ? '12' : '$1,240'}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mockUser.role === 'CUSTOMER' ? 'Active Specialists' : 'Jobs Nearby'}</p>
              <p className="text-xl font-bold">{mockUser.role === 'CUSTOMER' ? '8' : '3'}</p>
            </div>
          </div>
        </div>
        
        {/* Role-specific Dashboard Content */}
        <div className="dashboard-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <DashboardContext.Provider value={{ user: mockUser }}>
            {mockUser.role === 'CUSTOMER' ? (
              <CustomerDashboard />
            ) : mockUser.role === 'SPECIALIST' ? (
              <SpecialistDashboard />
            ) : (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to JobMate</h2>
                <p className="text-gray-500 mb-6">Please complete your profile to get started</p>
                <Button asChild>
                  <Link href="/profile">Complete Profile</Link>
                </Button>
              </div>
            )}
          </DashboardContext.Provider>
        </div>
      </div>
    </div>
  );
}
