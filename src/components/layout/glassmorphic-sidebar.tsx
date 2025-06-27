"use client";

import { useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Search, 
  MessageSquare, 
  Briefcase, 
  User,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  Bell,
  Wallet,
  MapPin,
  Calendar,
  Shield,
  BarChart,
  Wrench,
  Share2,
  Users,
  DollarSign,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLayout } from "@/contexts/LayoutContext";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Helper function to get initials if not available in utils
if (typeof getInitials !== 'function') {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
}

interface GlassmorphicSidebarProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

// Memoize the sidebar to prevent unnecessary re-renders
export const GlassmorphicSidebar = memo(function GlassmorphicSidebar({
  isMobile = false,
  onMobileClose
}: GlassmorphicSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useLayout();
  
  // Create an optimized navigation handler function without state tracking
  const createNavigationHandler = useCallback((itemHref: string) => {
    return (e: React.MouseEvent) => {
      // Only handle navigation if not already on the page
      if (itemHref !== pathname) {
        // Use native navigation for better performance
        // No state tracking needed
      }
    };
  }, [pathname]);
  
  // Prefetch all navigation routes on component mount
  useEffect(() => {
    // Get all navigation items
    const items = getNavItems();
    
    // Prefetch all routes in the background
    items.forEach(item => {
      if (item.href !== pathname) {
        router.prefetch(item.href);
      }
    });
  }, [pathname, router]);
  
  // Define the type for navigation items
  type NavItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | null;
    verificationLevel?: number; // 0 = no verification needed, 1-3 = verification levels
  };

  // Define navigation items based on user authentication and role
  const getNavItems = () => {
    // Items for unauthenticated users
    if (!isAuthenticated) {
      const unauthenticatedItems = [
        { 
          href: "/", 
          label: "Home", 
          icon: <Home className="h-5 w-5" />,
          verificationLevel: 0
        },
        { 
          href: "/marketplace", 
          label: "Marketplace", 
          icon: <Wrench className="h-5 w-5" />,
          verificationLevel: 0
        },
        { 
          href: "/login", 
          label: "Login", 
          icon: <User className="h-5 w-5" />,
          verificationLevel: 0
        },
        { 
          href: "/register", 
          label: "Sign Up", 
          icon: <User className="h-5 w-5" />,
          verificationLevel: 0
        },
      ];
      return unauthenticatedItems as NavItem[];
    }
    
    // Base items for authenticated users
    const authenticatedItems = [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <Home className="h-5 w-5" />,
        badge: null,
        verificationLevel: 0
      },
      { 
        href: "/marketplace", 
        label: "Marketplace", 
        icon: <Wrench className="h-5 w-5" />,
        badge: null,
        verificationLevel: 0
      },
      { 
        href: "/jobs", 
        label: "My Jobs", 
        icon: <Briefcase className="h-5 w-5" />,
        badge: "2",
        verificationLevel: 1
      },
      { 
        href: "/messages", 
        label: "Messages", 
        icon: <MessageSquare className="h-5 w-5" />,
        badge: "3",
        verificationLevel: 1
      },
      { 
        href: "/map", 
        label: "Map View", 
        icon: <MapPin className="h-5 w-5" />,
        badge: null,
        verificationLevel: 0
      },
      { 
        href: "/finance", 
        label: "Wallet", 
        icon: <Wallet className="h-5 w-5" />,
        badge: null,
        verificationLevel: 2
      },
      { 
        href: "/profile", 
        label: "My Profile", 
        icon: <User className="h-5 w-5" />,
        badge: null,
        verificationLevel: 0
      },
      { 
        href: "/profile/affiliate", 
        label: "Affiliate Program", 
        icon: <Users className="h-5 w-5" />,
        badge: null,
        verificationLevel: 0
      },
      { 
        href: "/verifications", 
        label: "Verifications", 
        icon: <Shield className="h-5 w-5" />,
        badge: null,
        verificationLevel: 0
      },
      { 
        href: "/social-connections", 
        label: "Social Media", 
        icon: <Share2 className="h-5 w-5" />,
        badge: null,
        verificationLevel: 1
      },
      { 
        href: "/insights", 
        label: "Insights & Stats", 
        icon: <BarChart className="h-5 w-5" />,
        badge: null,
        verificationLevel: 2
      },
      { 
        href: "/assistant/analytics", 
        label: "Assistant Analytics", 
        icon: <BarChart className="h-5 w-5 text-blue-500" />,
        badge: null,
        verificationLevel: 2
      },
      { 
        href: "/settings", 
        label: "Settings", 
        icon: <Settings className="h-5 w-5" />,
        badge: null,
        verificationLevel: 0
      },
    ];
    
    // Add role-specific items
    if (user?.role === "ADMIN") {
      authenticatedItems.splice(9, 0, { 
        href: "/admin", 
        label: "Admin Panel", 
        icon: <Settings className="h-5 w-5" />,
        badge: null,
        verificationLevel: 3
      });
    }
    
    return authenticatedItems as NavItem[];
  };

  const navItems = getNavItems();
  
  // Get user verification level (mock - replace with actual data)
  // Using type assertion to handle the User type
  const userVerificationLevel = (user as any)?.verificationLevel || 0;
  
  return (
    <div className={cn(
      "flex flex-col h-screen border-r border-white/20 dark:border-gray-800/30 transition-all duration-300",
      "bg-white/10 dark:bg-gray-900/20 backdrop-blur-md",
      isMobile ? "w-[238px]" : (sidebarCollapsed ? "w-[5rem]" : "w-64"),
      !isMobile && "hidden md:flex"
    )}>
      {/* Logo and collapse/close button */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/10 dark:border-gray-800/20">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
          {(!sidebarCollapsed || isMobile) && (
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">JobMate</span>
              <span className="ml-1 text-sm bg-blue-500 text-white px-2 py-1 rounded-md font-medium">
                AI
              </span>
            </div>
          )}
          {sidebarCollapsed && !isMobile && <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">JM</span>}
        </Link>
        {isMobile ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMobileClose}
            className="h-8 w-8 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20"
          >
            {sidebarCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </Button>
        )}
      </div>
      
      {/* User profile section */}
      {isAuthenticated && (
        <div className={cn(
          "flex items-center border-b border-white/10 dark:border-gray-800/20 p-4",
          sidebarCollapsed ? "justify-center" : "space-x-3"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={(user as any)?.avatarUrl || ""} alt={(user as any)?.name || "User"} />
            <AvatarFallback>{getInitials((user as any)?.name || "User")}</AvatarFallback>
          </Avatar>
          
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{(user as any)?.name}</p>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full" 
                    style={{ width: `${(userVerificationLevel / 3) * 100}%` }}
                  />
                </div>
                <span className="text-xs ml-2">Level {userVerificationLevel}</span>
              </div>
            </div>
          )}
        </div>
      )}
      


      {/* Navigation items */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'scrollbar-hide' : ''} py-2`}>
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            // Remove verification level check - all items accessible
            
            // Get the navigation handler for this item
            const handleNavigation = createNavigationHandler(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors group relative",
                  isActive 
                    ? "bg-white/20 dark:bg-gray-800/40 text-brand-600 dark:text-brand-400" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/20"
                )}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 relative">
                    {item.icon}
                  </span>
                  
                  {!sidebarCollapsed && (
                    <span className="ml-3 flex-1 truncate">{item.label}</span>
                  )}
                  
                  {!sidebarCollapsed && item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                  
                  {sidebarCollapsed && item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Bottom actions */}
      {isAuthenticated && (
        <div className={cn(
          "p-4 border-t border-white/10 dark:border-gray-800/20",
          sidebarCollapsed ? "flex justify-center" : ""
        )}>
          <Button
            variant="ghost"
            className={cn(
              "text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/20",
              sidebarCollapsed ? "w-10 h-10 p-0" : "w-full"
            )}
            onClick={() => logout()}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      )}
    </div>
  );
});



