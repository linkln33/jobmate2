"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Bell, 
  Menu,
  ChevronDown,
  Settings,
  User,
  LogOut,
  HelpCircle,
  MessageSquare,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLayout } from "@/contexts/LayoutContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavBarDashboardProps {
  title?: string;
  showSearch?: boolean;
  onMobileMenuClick?: () => void;
}

export function NavBarDashboard({ 
  title, 
  showSearch = true,
  onMobileMenuClick 
}: NavBarDashboardProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { sidebarCollapsed } = useLayout();
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  // Check system preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || 
                         document.documentElement.classList.contains('dark');
      setDarkMode(isDarkMode);
    }
  }, []);
  
  // Helper function to get initials if not available in utils
  const getInitialsLocal = (name: string) => {
    if (typeof getInitials === 'function') {
      return getInitials(name);
    }
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className={cn(
      "h-16 border-b border-white/20 dark:border-gray-800/30 flex items-center justify-between px-4",
      "bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl backdrop-saturate-150 sticky top-0 z-10"
    )}>
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMobileMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Navigation links removed as requested */}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 rounded-full text-sm bg-white/30 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 backdrop-blur-md"
            />
          </div>
        )}
        
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full hover:bg-white/10 dark:hover:bg-gray-800/50"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </Button>
        
        {/* Messages */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 border-white/30 dark:border-gray-800/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
              <DropdownMenuLabel>Recent Messages</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/30" />
              
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-white/20 dark:hover:bg-gray-800/20 cursor-pointer">
                  <div className="flex items-center mb-1">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">JS</div>
                    <div>
                      <p className="text-sm font-medium">Jane Smith</p>
                      <p className="text-xs text-gray-400">10:30 AM</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">When will you arrive?</p>
                </div>
                
                <div className="p-3 hover:bg-white/20 dark:hover:bg-gray-800/20 cursor-pointer">
                  <div className="flex items-center mb-1">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">MJ</div>
                    <div>
                      <p className="text-sm font-medium">Mark Johnson</p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Job completed successfully!</p>
                </div>
                
                <div className="p-3 hover:bg-white/20 dark:hover:bg-gray-800/20 cursor-pointer">
                  <div className="flex items-center mb-1">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">ST</div>
                    <div>
                      <p className="text-sm font-medium">Support Team</p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your verification is approved</p>
                </div>
              </div>
              
              <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/30" />
              <DropdownMenuItem className="justify-center text-blue-500">Open Messages</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Notifications */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 border-white/30 dark:border-gray-800/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/30" />
              
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-white/20 dark:hover:bg-gray-800/20 cursor-pointer">
                  <p className="text-sm font-medium">New job match available</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">A new job matching your skills is available in your area.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">10 minutes ago</p>
                </div>
                
                <div className="p-3 hover:bg-white/20 dark:hover:bg-gray-800/20 cursor-pointer">
                  <p className="text-sm font-medium">Message from John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hey, are you available for a quick call?</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
                </div>
                
                <div className="p-3 hover:bg-white/20 dark:hover:bg-gray-800/20 cursor-pointer">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You received a payment of $150 for job #1234.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">3 hours ago</p>
                </div>
              </div>
              
              <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/30" />
              <DropdownMenuItem className="justify-center text-blue-500">View all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* User menu */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || ""} alt={`${user?.firstName} ${user?.lastName}` || "User"} />
                  <AvatarFallback>{getInitialsLocal(`${user?.firstName || ''} ${user?.lastName || ''}` || "User")}</AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium hidden lg:block">{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 border-white/30 dark:border-gray-800/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/30" />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/30" />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/signup">Sign Up</a>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
