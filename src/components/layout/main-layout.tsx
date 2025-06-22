"use client";

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { Sidebar } from './sidebar';
import { BottomTabs } from './bottom-tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLayout } from '@/contexts/LayoutContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuth();
  const { sidebarCollapsed } = useLayout();
  const pathname = usePathname();
  
  // Check if we're on the dashboard page
  const isDashboardPage = pathname === '/dashboard';
  
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar - only visible after login */}
      {isAuthenticated && <Sidebar />}
      
      {/* Main content wrapper - takes all remaining space */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        {/* Top navbar - only shown when not authenticated */}
        {!isAuthenticated && <Navbar />}
        
        {/* Main content */}
        <main className={`flex-1 ${isAuthenticated ? 'pb-16 md:pb-0' : ''}`}>{children}</main>
        
        {/* Footer - only shown when not authenticated */}
        {!isAuthenticated && <Footer />}
      </div>
      
      {/* Mobile bottom tabs - only visible after login */}
      {isAuthenticated && <BottomTabs />}
    </div>
  );
}
