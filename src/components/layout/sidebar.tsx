"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLayout } from "@/contexts/LayoutContext";

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

interface SidebarProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobile = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useLayout();
  
  // Define the type for navigation items
  type NavItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | null;
  };

  // Define navigation items based on user authentication and role
  const getNavItems = () => {
    // Items for unauthenticated users
    if (!isAuthenticated) {
      const unauthenticatedItems = [
        { 
          href: "/", 
          label: "Home", 
          icon: <Home className="h-5 w-5" /> 
        },
        { 
          href: "/marketplace", 
          label: "Marketplace", 
          icon: <Wrench className="h-5 w-5" /> 
        },
        { 
          href: "/login", 
          label: "Login", 
          icon: <User className="h-5 w-5" /> 
        },
        { 
          href: "/register", 
          label: "Sign Up", 
          icon: <User className="h-5 w-5" /> 
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
        badge: null
      },
      { 
        href: "/marketplace", 
        label: "Marketplace", 
        icon: <Wrench className="h-5 w-5" />,
        badge: null
      },
      { 
        href: "/jobs", 
        label: "My Jobs", 
        icon: <Briefcase className="h-5 w-5" />,
        badge: "2"
      },
      { 
        href: "/messages", 
        label: "Messages", 
        icon: <MessageSquare className="h-5 w-5" />,
        badge: "3"
      },
      { 
        href: "/map", 
        label: "Map View", 
        icon: <MapPin className="h-5 w-5" />,
        badge: null
      },
      { 
        href: "/finance", 
        label: "Wallet", 
        icon: <Wallet className="h-5 w-5" />,
        badge: null
      },
      { 
        href: "/profile", 
        label: "My Profile", 
        icon: <User className="h-5 w-5" />,
        badge: null
      },
      { 
        href: "/verifications", 
        label: "Verifications", 
        icon: <Shield className="h-5 w-5" />,
        badge: null
      },
      { 
        href: "/social-connections", 
        label: "Social Media", 
        icon: <Share2 className="h-5 w-5" />,
        badge: null
      },
      { 
        href: "/insights", 
        label: "Insights & Stats", 
        icon: <BarChart className="h-5 w-5" />,
        badge: null
      },
      { 
        href: "/assistant/analytics", 
        label: "Assistant Analytics", 
        icon: <BarChart className="h-5 w-5 text-blue-500" />,
        badge: null
      },
      { 
        href: "/settings", 
        label: "Settings", 
        icon: <Settings className="h-5 w-5" />,
        badge: null
      },
    ];
    
    // Add role-specific items
    if (user?.role === "ADMIN") {
      authenticatedItems.splice(9, 0, { 
        href: "/admin", 
        label: "Admin Panel", 
        icon: <Settings className="h-5 w-5" />,
        badge: null
      });
    }
    
    return authenticatedItems as NavItem[];
  };

  const navItems = getNavItems();
  
  return (
    <div className={cn(
      "flex flex-col h-screen border-r border-border bg-background transition-all duration-300",
      isMobile ? "w-[280px]" : (sidebarCollapsed ? "w-[5rem]" : "w-64"),
      !isMobile && "hidden md:flex"
    )}>
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
          {(!sidebarCollapsed || isMobile) && <span className="text-2xl font-bold text-brand-500">JobMate</span>}
          {sidebarCollapsed && !isMobile && <span className="text-2xl font-bold text-brand-500">JM</span>}
        </Link>
        {isMobile ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMobileClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-full"
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>
      
      {/* User profile section */}
      {isAuthenticated && user && (
        <div className={cn(
          "flex items-center border-b border-border p-4",
          sidebarCollapsed ? "flex-col" : "space-x-3"
        )}>
          <Avatar>
            <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName} />
            <AvatarFallback className="bg-brand-100 text-brand-800">
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </AvatarFallback>
          </Avatar>
          
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-3 rounded-md transition-colors",
                pathname === item.href 
                  ? "bg-brand-50 text-brand-500" 
                  : "text-foreground/80 hover:bg-accent hover:text-foreground",
                sidebarCollapsed ? "justify-center" : "space-x-3"
              )}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              {sidebarCollapsed && item.badge && (
                <span className="absolute top-0 right-0 bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Bottom actions */}
      {isAuthenticated && user && (
        <div className={cn(
          "border-t border-border p-4",
          sidebarCollapsed ? "flex flex-col items-center" : ""
        )}>
          <Button 
            variant="ghost" 
            size={sidebarCollapsed ? "icon" : "default"}
            className={cn("w-full", sidebarCollapsed ? "rounded-full" : "")}
            onClick={() => logout()}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-2">Log out</span>}
          </Button>
        </div>
      )}
    </div>
  );
}
