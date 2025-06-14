"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Menu,
  X,
  MessageSquare, 
  Briefcase, 
  User,
  Settings,
  LogOut,
  Wallet,
  MapPin,
  Bell,
  Wrench,
  Shield,
  Share2,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function MobileNav() {
  // Add animation keyframes to the document
  useEffect(() => {
    // Add custom animation styles to the document head
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
      }
      
      .animate-slide-down {
        animation: slideDown 0.3s ease forwards;
      }
      
      .animate-slide-up {
        animation: slideUp 0.3s ease forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState('menu-closed');
  
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
        href: "/settings", 
        label: "Settings", 
        icon: <Settings className="h-5 w-5" />,
        badge: null
      },
    ];
    
    return authenticatedItems as NavItem[];
  };

  const navItems = getNavItems();
  
  const toggleMenu = () => {
    if (isOpen) {
      setMenuAnimation('menu-closing');
      setTimeout(() => {
        setIsOpen(false);
        setMenuAnimation('menu-closed');
      }, 300);
    } else {
      setIsOpen(true);
      setMenuAnimation('menu-opening');
    }
  };
  
  useEffect(() => {
    // Prevent body scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <div className="md:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
          <span className="text-xl font-bold text-brand-500">JobMate</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            className="rounded-full"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className={`fixed inset-0 bg-background/90 backdrop-blur-sm z-50 pt-16 transition-all duration-300 ${menuAnimation === 'menu-opening' ? 'animate-slide-down' : menuAnimation === 'menu-closing' ? 'animate-slide-up' : ''}`}>
          {/* User profile section */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-3 p-4 border-b border-border">
              <Avatar>
                <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName} />
                <AvatarFallback className="bg-brand-100 text-brand-800">
                  {getInitials ? getInitials(`${user.firstName} ${user.lastName}`) : `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
            </div>
          )}
          
          {/* Navigation items */}
          <div className="overflow-y-auto h-[calc(100vh-180px)]">
            <nav className="space-y-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-colors",
                    pathname === item.href 
                      ? "bg-brand-50 text-brand-500" 
                      : "text-foreground/80 hover:bg-accent hover:text-foreground",
                    "space-x-3"
                  )}
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Bottom actions */}
          {isAuthenticated && (
            <div className="border-t border-border p-4 absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Log out</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
