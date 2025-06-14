"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { 
  User, 
  Wallet, 
  Settings, 
  LogOut, 
  Share2, 
  BarChart, 
  Briefcase,
  MapPin,
  Home,
  Wrench,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MorePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return null;
  }

  const menuItems = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      description: "View your dashboard and activity"
    },
    { 
      href: "/marketplace", 
      label: "Marketplace", 
      icon: <Wrench className="h-5 w-5" />,
      description: "Browse services and job categories"
    },
    { 
      href: "/jobs", 
      label: "My Jobs", 
      icon: <Briefcase className="h-5 w-5" />,
      description: "Manage your job listings and applications",
      badge: "2"
    },
    { 
      href: "/messages", 
      label: "Messages", 
      icon: <MessageSquare className="h-5 w-5" />,
      description: "View your conversations and messages",
      badge: "3"
    },
    { 
      href: "/map", 
      label: "Map View", 
      icon: <MapPin className="h-5 w-5" />,
      description: "View jobs and specialists on the map"
    },
    { 
      href: "/finance", 
      label: "Wallet", 
      icon: <Wallet className="h-5 w-5" />,
      description: "Manage your payments and transactions"
    },
    { 
      href: "/profile", 
      label: "My Profile", 
      icon: <User className="h-5 w-5" />,
      description: "View and edit your profile information"
    },
    { 
      href: "/verifications", 
      label: "Verifications", 
      icon: <Shield className="h-5 w-5" />,
      description: "Manage your identity and skill verifications"
    },
    { 
      href: "/social-connections", 
      label: "Social Media", 
      icon: <Share2 className="h-5 w-5" />,
      description: "Connect and manage your social accounts"
    },
    { 
      href: "/insights", 
      label: "Insights & Stats", 
      icon: <BarChart className="h-5 w-5" />,
      description: "View your performance analytics"
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />,
      description: "Customize your app preferences"
    }
  ];

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">More Options</h1>
        
        {/* User profile card */}
        {user && (
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName} />
              <AvatarFallback className="bg-brand-100 text-brand-800 text-lg">
                {getInitials(`${user.firstName} ${user.lastName}`)}
              </AvatarFallback>
            </Avatar>
            
            <div className="ml-4">
              <h2 className="font-semibold text-lg">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <Link href="/profile" className="text-sm text-brand-500 mt-1 inline-block">
                View Profile
              </Link>
            </div>
          </div>
        )}
        
        {/* Menu items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg transition-colors",
                "bg-white hover:bg-brand-50 shadow-sm"
              )}
            >
              <div className="flex items-center">
                <div className="bg-brand-50 p-2 rounded-full">
                  {item.icon}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              {item.badge && (
                <div className="bg-brand-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </Link>
          ))}
        </div>
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center p-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Log out</span>
        </button>
      </div>
    </MainLayout>
  );
}
