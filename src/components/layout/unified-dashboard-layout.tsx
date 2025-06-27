"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { GlassmorphicSidebar } from './glassmorphic-sidebar';
import { NavBarDashboard } from './navbar-dashboard';
import { StickyNavbar } from '@/components/ui/sticky-navbar';
import { FloatingAssistant } from '@/components/assistant/FloatingAssistant';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
// Removed Sheet import
import { useAuth } from '@/contexts/AuthContext';
import { RoutePrefetcher } from '@/lib/route-prefetcher';

interface UnifiedDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  showMap?: boolean;
  mapComponent?: React.ReactNode;
  hideSidebar?: boolean;
  isPublicPage?: boolean; // Add this prop to indicate if it's a public page (home, landing, etc.)
  hideDashboardButton?: boolean; // Add this prop to hide the dashboard button in the navbar
}

export function UnifiedDashboardLayout({
  children,
  title = "Dashboard",
  showSearch = true,
  showMap = true,
  mapComponent,
  hideSidebar = false,
  isPublicPage = false,
  hideDashboardButton = false
}: UnifiedDashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Debug mobile menu state changes
  useEffect(() => {
    console.log('Mobile menu state changed:', mobileMenuOpen);
  }, [mobileMenuOpen]);
  const { isAuthenticated } = useAuth();
  
  // We no longer need this variable as we've simplified the logic below

  return (
    <div className="h-screen flex flex-col bg-background dark:bg-background">
      {/* Mobile sidebar with backdrop */}
      {!hideSidebar && (
        <div 
          className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Invisible backdrop for click handling only */}
          <div 
            className="fixed inset-0" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sidebar panel with slide-in animation */}
          <div 
            className={`fixed inset-y-0 left-0 shadow-xl overflow-y-auto scrollbar-hide transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="h-full overflow-y-auto scrollbar-hide pb-20">
              <GlassmorphicSidebar isMobile={true} onMobileClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Route prefetcher for optimized navigation */}
      <RoutePrefetcher />
      
      {/* Desktop layout */}
      <div className="flex h-full">
        {/* Desktop sidebar */}
        {!hideSidebar && (
          <div className="hidden md:block">
            <GlassmorphicSidebar />
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Show StickyNavbar only for non-authenticated users and non-dashboard pages */}
          {!isAuthenticated && title !== "Dashboard" && (
            <StickyNavbar hideDashboardButton={hideDashboardButton} />
          )}
          
          {/* Show NavBarDashboard for authenticated users */}
          {isAuthenticated && (
            <NavBarDashboard 
              title={title} 
              showSearch={showSearch} 
              onMobileMenuClick={() => setMobileMenuOpen(true)} 
            />
          )}
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
            {/* Content area - improved mobile responsiveness */}
            <div className="h-full">
              <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {showMap && mapComponent ? (
                  <div className="h-full">
                    {mapComponent}
                  </div>
                ) : (
                  children
                )}
              </div>
            </div>

            {/* AI Assistant */}
            <FloatingAssistant />
          </main>
        </div>
      </div>
    </div>
  );
}
