"use client";

import React, { useState, Suspense } from 'react';
import { GlassmorphicSidebar } from './glassmorphic-sidebar';
import { GlassmorphicHeader } from './glassmorphic-header';
import { StickyNavbar } from '@/components/ui/sticky-navbar';
import { FloatingAssistant } from '@/components/assistant/FloatingAssistant';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
  const { isAuthenticated } = useAuth();
  
  // Always show the sticky navbar on public pages, regardless of authentication status
  const showPublicNavbar = isPublicPage;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile sidebar */}
      {!hideSidebar && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-transparent">
            <div className="h-full">
              <GlassmorphicSidebar />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop layout */}
      <div className="flex h-full">
        {/* Desktop sidebar */}
        {!hideSidebar && (
          <div className="hidden md:block w-64">
            <GlassmorphicSidebar />
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Show StickyNavbar for all public pages */}
          {(showPublicNavbar || isAuthenticated) && (
            <StickyNavbar hideDashboardButton={hideDashboardButton} />
          )}
          
          {/* Always show GlassmorphicHeader for authenticated users */}
          {isAuthenticated && (
            <GlassmorphicHeader 
              title={title} 
              showSearch={showSearch} 
              onMobileMenuClick={() => setMobileMenuOpen(true)} 
            />
          )}
          
          {/* Main content */}
          <main className="flex-1 overflow-hidden relative">
            {/* Content area - improved mobile responsiveness */}
            <div className="h-full overflow-auto bg-white/5 dark:bg-gray-900/5">
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
