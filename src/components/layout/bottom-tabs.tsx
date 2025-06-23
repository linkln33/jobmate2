"use client";

import { useState, useEffect } from "react";
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Search, 
  MessageSquare, 
  Menu, 
  PlusCircle,
  Briefcase,
  Wrench,
  X,
  User,
  Wallet,
  Shield,
  Share2,
  BarChart,
  Settings,
  LogOut,
  MapPin
} from 'lucide-react';

// Define the type for navigation items
type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | null;
  isSpecial?: boolean;
  action?: string;
};

export function BottomTabs() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Define tabs based on user authentication and role
  const getTabs = (): NavItem[] => {
    // Only show tabs for authenticated users
    if (isAuthenticated) {
      // Base tabs for all authenticated users
      const baseTabs: NavItem[] = [
        { 
          href: "/dashboard", 
          label: "Home", 
          icon: <Home className="h-5 w-5" /> 
        },
        { 
          href: "/marketplace", 
          label: "Search", 
          icon: <Search className="h-5 w-5" /> 
        },
        { 
          href: "#", 
          label: "Add", 
          icon: <PlusCircle className="h-5 w-5" />,
          isSpecial: true,
          action: "showAddMenu"
        },
        { 
          href: "/messages", 
          label: "Chat", 
          icon: <MessageSquare className="h-5 w-5" /> 
        },
        { 
          href: "/more", 
          label: "Menu", 
          icon: <Menu className="h-5 w-5" /> 
        },
      ];
      
      return baseTabs;
    }
    
    // For unauthenticated users
    return [
      { 
        href: "/", 
        label: "Home", 
        icon: <Home className="h-5 w-5" /> 
      },
      { 
        href: "/marketplace", 
        label: "Search", 
        icon: <Search className="h-5 w-5" /> 
      },
      { 
        href: "#", 
        label: "Add", 
        icon: <PlusCircle className="h-5 w-5" />,
        isSpecial: true,
        action: "showAddMenu"
      },
      { 
        href: "/login", 
        label: "Chat", 
        icon: <MessageSquare className="h-5 w-5" /> 
      },
      { 
        href: "/login", 
        label: "Menu", 
        icon: <Menu className="h-5 w-5" /> 
      },
    ] as NavItem[];
  };

  const tabs = getTabs();
  
  // Handle add menu actions
  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAddMenu(!showAddMenu);
    if (showMenu) setShowMenu(false); // Close menu if open
  };
  
  // Handle menu toggle
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(!showMenu);
    if (showAddMenu) setShowAddMenu(false); // Close add menu if open
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      {/* Add Menu Popup */}
      {showAddMenu && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 w-48 z-50 border border-border">
          <div className="flex flex-col space-y-1">
            <Link 
              href="/jobs/create"
              className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-md"
              onClick={() => setShowAddMenu(false)}
            >
              <Briefcase className="h-5 w-5 text-brand-500" />
              <span>Add a Job</span>
            </Link>
            <Link 
              href="/services/create"
              className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-md"
              onClick={() => setShowAddMenu(false)}
            >
              <Wrench className="h-5 w-5 text-brand-500" />
              <span>Add a Service</span>
            </Link>
          </div>
        </div>
      )}
      
      {/* Sliding Menu */}
      <div 
        className={`fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-t-xl z-40 transform transition-transform duration-300 ease-in-out ${showMenu ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h2 className="text-xl font-bold">Menu</h2>
            <button 
              onClick={handleMenuToggle}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* User Profile Section */}
          {isAuthenticated && user && (
            <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName} />
                <AvatarFallback className="bg-brand-100 text-brand-800">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <Link 
                  href="/profile" 
                  className="text-sm text-brand-600"
                  onClick={() => setShowMenu(false)}
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}
          
          {/* Menu Items */}
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <Home className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Dashboard</span>
              </div>
            </Link>
            
            <Link href="/marketplace" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <Wrench className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Marketplace</span>
              </div>
            </Link>
            
            <Link href="/jobs" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span className="ml-3">My Jobs</span>
              </div>
              <div className="bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">2</div>
            </Link>
            
            <Link href="/messages" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Messages</span>
              </div>
              <div className="bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</div>
            </Link>
            
            <Link href="/map" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Map View</span>
              </div>
            </Link>
            
            <Link href="/finance" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Wallet</span>
              </div>
            </Link>
            
            <Link href="/profile" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500" />
                <span className="ml-3">My Profile</span>
              </div>
            </Link>
            
            <Link href="/verifications" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Verifications</span>
              </div>
            </Link>
            
            <Link href="/social-connections" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <Share2 className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Social Media</span>
              </div>
            </Link>
            
            <Link href="/insights" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Insights & Stats</span>
              </div>
            </Link>
            
            <Link href="/settings" className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg" onClick={() => setShowMenu(false)}>
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-500" />
                <span className="ml-3">Settings</span>
              </div>
            </Link>
          </div>
          
          {/* Logout Button */}
          {isAuthenticated && (
            <button 
              className="w-full mt-4 flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg"
              onClick={() => {
                // Handle logout logic here
                setShowMenu(false);
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Invisible click capture layer (no visual styling) */}
      {(showAddMenu || showMenu) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowAddMenu(false);
            setShowMenu(false);
          }}
        />
      )}
      
      <div className="flex items-center justify-around h-16 px-4 relative">
        {tabs.map((tab) => {
          if (tab.isSpecial) {
            return (
              <button
                key="add-button"
                onClick={handleAddButtonClick}
                className="flex flex-col items-center justify-center flex-1 h-full"
              >
                <PlusCircle className={`h-5 w-5 ${showAddMenu ? 'text-brand-500' : 'text-muted-foreground'}`} />
                <span className="text-xs mt-1">Add</span>
              </button>
            );
          }
          
          if (tab.label === 'Menu') {
            return (
              <button
                key="menu-button"
                onClick={handleMenuToggle}
                className="flex flex-col items-center justify-center flex-1 h-full"
              >
                <Menu className={`h-5 w-5 ${showMenu ? 'text-brand-500' : 'text-muted-foreground'}`} />
                <span className="text-xs mt-1">Menu</span>
              </button>
            );
          }
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                pathname === tab.href
                  ? "text-brand-500"
                  : "text-muted-foreground"
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
