"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardContent,
  GlassCardFooter
} from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  BarChart, 
  MapPin, 
  Briefcase, 
  MessageSquare, 
  User,
  Shield,
  Bell,
  ChevronRight,
  Clock,
  Star,
  Wallet,
  AlertCircle,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { InteractiveMapWithFilters } from '@/components/map/interactive-map-with-filters';
import { Job } from '@/types/job';

export function UnifiedDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  
  // Mock verification level (replace with actual user data)
  const verificationLevel: number = 1; // 0-3 scale
  const verificationProgress = (verificationLevel / 3) * 100;
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null; // Loading handled by parent component
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }
  
  // Mock data for dashboard cards
  const upcomingJobs = [
    { id: 1, title: 'Home Cleaning', date: '2025-06-18T14:00:00', location: 'Downtown', status: 'confirmed' },
    { id: 2, title: 'Garden Maintenance', date: '2025-06-20T10:30:00', location: 'Suburbs', status: 'pending' }
  ];
  
  // Mock jobs for the map
  const mockJobs = [
    {
      id: '1',
      title: 'Home Cleaning',
      description: 'Need help cleaning a 2-bedroom apartment',
      status: 'open',
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
      zipCode: '94103',
      budgetMin: 80,
      budgetMax: 120,
      createdAt: '2025-06-15',
      urgencyLevel: 'high',
      isVerifiedPayment: true,
      isNeighborPosted: true,
      serviceCategory: {
        id: '1',
        name: 'Cleaning'
      },
      customer: {
        id: '101',
        firstName: 'John',
        lastName: 'Doe'
      }
    },
    {
      id: '2',
      title: 'Garden Maintenance',
      description: 'Need help with garden work and landscaping',
      status: 'open',
      lat: 37.7833,
      lng: -122.4167,
      city: 'San Francisco',
      zipCode: '94109',
      budgetMin: 100,
      budgetMax: 150,
      createdAt: '2025-06-16',
      urgencyLevel: 'medium',
      isVerifiedPayment: true,
      isNeighborPosted: false,
      serviceCategory: {
        id: '2',
        name: 'Gardening'
      },
      customer: {
        id: '102',
        firstName: 'Jane',
        lastName: 'Smith'
      }
    }
  ];
  
  // Categories for the map
  const jobCategories = [
    { id: '1', name: 'Cleaning' },
    { id: '2', name: 'Gardening' },
    { id: '3', name: 'Delivery' },
    { id: '4', name: 'Repairs' }
  ];
  
  const recentMessages = [
    { id: 1, from: 'Jane Smith', avatar: '', message: 'When will you arrive?', time: '10:30 AM' },
    { id: 2, from: 'Mark Johnson', avatar: '', message: 'Job completed successfully!', time: 'Yesterday' },
    { id: 3, from: 'Support Team', avatar: '', message: 'Your verification is approved', time: '2 days ago' }
  ];

  return (
    <UnifiedDashboardLayout title="Dashboard" showMap={false} isPublicPage={false}>
      {/* Main content with glassmorphic cards */}
      <div className="p-6">
        {/* Verification Banner - Dismissible */}
        {showVerificationBanner && (
          <div className="mb-6 relative bg-orange-500/30 backdrop-blur-sm border border-orange-300/40 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-orange-500 mr-4" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-orange-900 dark:text-orange-100">Complete your verification</h3>
                  <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                    {verificationLevel <= 0 ? 'Start the verification process to unlock more features.' : 
                     `You've completed ${verificationLevel.toString()} of 3 verification steps.`}
                  </p>
                  <Progress value={verificationProgress} className="h-1.5 mt-2 bg-orange-200/50" indicatorClassName="bg-orange-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="default" className="bg-orange-600 hover:bg-orange-700 text-white">
                    Continue
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-orange-700 hover:bg-orange-400/20" 
                    onClick={() => setShowVerificationBanner(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard content grid - improved mobile responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Quick Overview */}
          <GlassCard className="col-span-full">
            <GlassCardHeader>
              <GlassCardTitle>Quick Overview</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-white/10 dark:bg-gray-800/20">
                  <Users className="h-8 w-8 mb-2 text-blue-500" />
                  <span className="text-2xl font-bold">24</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Matched Services</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-white/10 dark:bg-gray-800/20">
                  <Briefcase className="h-8 w-8 mb-2 text-green-500" />
                  <span className="text-2xl font-bold">8</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Upcoming Jobs</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-white/10 dark:bg-gray-800/20">
                  <BarChart className="h-8 w-8 mb-2 text-purple-500" />
                  <span className="text-2xl font-bold">12</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Accepted Jobs</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-white/10 dark:bg-gray-800/20">
                  <Wallet className="h-8 w-8 mb-2 text-green-500" />
                  <span className="text-2xl font-bold">$1,240</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Paid Balance</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-white/10 dark:bg-gray-800/20">
                  <Clock className="h-8 w-8 mb-2 text-yellow-500" />
                  <span className="text-2xl font-bold">$480</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pending Balance</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-white/10 dark:bg-gray-800/20">
                  <MapPin className="h-8 w-8 mb-2 text-orange-500" />
                  <span className="text-2xl font-bold">15</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Nearby Services</span>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Interactive Map */}
          <GlassCard className="col-span-full mb-6 sm:mb-8">

            <GlassCardContent className="p-0 pb-2">
              <div className="h-[500px] sm:h-[455px] md:h-[585px] w-full">
                <InteractiveMapWithFilters
                  height="100%"
                  onJobSelect={(job) => console.log('Selected job:', job)}
                  filterChipStyle={{
                    chipWidth: '120px',  // Increased length for better visibility
                    useFullName: false,  // Use single-word names like homepage
                    paddingLeft: '12px', // More padding on the left
                    paddingRight: '10px', // More padding on the right
                  }}
                  showActivityDotsOnMap={true}
                />
              </div>
            </GlassCardContent>
            <GlassCardFooter className="pt-1 pb-3">
              <div className="h-2"></div>
            </GlassCardFooter>
          </GlassCard>

          {/* Upcoming Jobs */}
          <GlassCard intensity="medium" className="col-span-full sm:col-span-1 md:col-span-1 mt-2 sm:mt-0">
            <GlassCardHeader className="flex flex-row items-center justify-between">
              <GlassCardTitle>Upcoming Jobs</GlassCardTitle>
              <Badge variant="outline" className="ml-2">
                {upcomingJobs.length}
              </Badge>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-4">
                {upcomingJobs.map(job => (
                  <div key={job.id} className="flex items-center p-2 sm:p-3 rounded-lg bg-white/10 dark:bg-gray-800/20 text-xs sm:text-sm">
                    <div className={`p-2 rounded-full mr-3 ${
                      job.status === 'confirmed' 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      <Clock className={`h-5 w-5 ${
                        job.status === 'confirmed'
                          ? 'text-green-600 dark:text-green-300'
                          : 'text-amber-600 dark:text-amber-300'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-xs sm:text-sm">{job.title}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{job.location}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(job.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {upcomingJobs.length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No upcoming jobs</p>
                  </div>
                )}
              </div>
            </GlassCardContent>
            <GlassCardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Jobs
              </Button>
            </GlassCardFooter>
          </GlassCard>
          {/* Messages */}
          <GlassCard intensity="medium" className="col-span-full sm:col-span-1 md:col-span-1">
            <GlassCardHeader className="flex flex-row items-center justify-between">
              <GlassCardTitle>Recent Messages</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-3">
                {recentMessages.map(msg => (
                  <div key={msg.id} className="flex items-center p-3 rounded-lg bg-white/10 dark:bg-gray-800/20">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={msg.avatar} alt={msg.from} />
                      <AvatarFallback>{msg.from.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{msg.from}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {recentMessages.length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No recent messages</p>
                  </div>
                )}
              </div>
            </GlassCardContent>
            <GlassCardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Open Messages
              </Button>
            </GlassCardFooter>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="col-span-full sm:col-span-1 md:col-span-1 lg:col-span-1">
            <GlassCardHeader>
              <GlassCardTitle>Recent Activity</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <Tabs defaultValue="jobs" className="w-full">
                <TabsList className="grid grid-cols-2 mb-2 sm:mb-4 w-full text-xs sm:text-sm">
                  <TabsTrigger value="jobs">Jobs</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>
                
                <TabsContent value="jobs" className="space-y-4">
                  {upcomingJobs.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/10 dark:bg-gray-800/20">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                          <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{job.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant={job.status === 'confirmed' ? 'success' : 'outline'}>
                        {job.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="services" className="space-y-4">
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/10 dark:bg-gray-800/20">
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900/30 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Home Cleaning Service</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">New listing in your area</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">New</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/10 dark:bg-gray-800/20">
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900/30 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Lawn Maintenance</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Price updated</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Updated</Badge>
                  </div>
                </TabsContent>
                

              </Tabs>
            </GlassCardContent>
            <GlassCardFooter>
              <Button variant="link" size="sm" className="w-full">
                View All Activity <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </GlassCardFooter>
          </GlassCard>

          {/* Recommended Services */}
          <GlassCard intensity="medium" className="col-span-full sm:col-span-full">
            <GlassCardHeader>
              <GlassCardTitle>Recommended Services</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map(id => (
                  <div key={id} className="bg-white/10 dark:bg-gray-800/20 rounded-lg overflow-hidden">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">Service {id}</h4>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs ml-1">4.8</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Category • Location</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">$25-45/hr</span>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCardContent>
            <GlassCardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Explore Marketplace
              </Button>
            </GlassCardFooter>
          </GlassCard>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
