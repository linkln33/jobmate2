"use client";

import React, { useState } from 'react';
import { GlassmorphicSidebar } from './glassmorphic-sidebar';
import { GlassmorphicHeader } from './glassmorphic-header';
import { Navbar } from './navbar';
import { FloatingAssistant } from '@/components/assistant/FloatingAssistant';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  showMap?: boolean;
  mapComponent?: React.ReactNode;
  hideSidebar?: boolean;
  isPublicPage?: boolean; // Add this prop to indicate if it's a public page (home, landing, etc.)
}

export function UnifiedDashboardLayout({
  children,
  title = "Dashboard",
  showSearch = true,
  showMap = true,
  mapComponent,
  hideSidebar = false,
  isPublicPage = false
}: UnifiedDashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // When user is authenticated, never show the public navbar
  // Only show public navbar on public pages when user is NOT authenticated
  const showPublicNavbar = isPublicPage && !isAuthenticated;

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
          <div className="hidden md:block">
            <GlassmorphicSidebar />
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Only show Navbar for public pages when not authenticated */}
          {showPublicNavbar && <Navbar />}
          
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
            {/* Content area */}
            <div className="h-full overflow-auto bg-white/5 dark:bg-gray-900/5">
              <div className="container mx-auto p-4">
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
