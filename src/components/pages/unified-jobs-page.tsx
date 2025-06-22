"use client";

import { useState } from 'react';
import Link from 'next/link';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardContent,
  GlassCardFooter
} from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, MapPin, PlusCircle, Filter, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function UnifiedJobsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  
  // Mock jobs data
  const jobs = [
    {
      id: 1,
      title: 'Website Redesign for E-commerce Store',
      description: 'Looking for an experienced web designer to redesign our e-commerce website. The website should be modern, responsive, and user-friendly.',
      budget: 2500,
      deadline: '2025-07-15',
      location: 'Remote',
      category: 'Web Development',
      status: 'active',
      proposals: 8,
      postedDate: '2025-06-01',
    },
    {
      id: 2,
      title: 'Mobile App Development for Fitness Tracking',
      description: 'We need a mobile app developer to create a fitness tracking app for iOS and Android. The app should track workouts, calories, and provide personalized recommendations.',
      budget: 5000,
      deadline: '2025-08-30',
      location: 'Remote',
      category: 'Mobile Development',
      status: 'active',
      proposals: 12,
      postedDate: '2025-06-05',
    },
    {
      id: 3,
      title: 'Logo Design for Tech Startup',
      description: 'Our startup needs a modern, professional logo that represents our brand values of innovation, reliability, and simplicity.',
      budget: 800,
      deadline: '2025-06-25',
      location: 'Remote',
      category: 'Design',
      status: 'completed',
      proposals: 24,
      postedDate: '2025-05-20',
    },
    {
      id: 4,
      title: 'Content Writing for Blog Articles',
      description: 'We need a content writer to create 10 blog articles about digital marketing trends. Each article should be 1500-2000 words and SEO optimized.',
      budget: 1200,
      deadline: '2025-07-10',
      location: 'Remote',
      category: 'Content Writing',
      status: 'completed',
      proposals: 15,
      postedDate: '2025-05-15',
    },
    {
      id: 5,
      title: 'Social Media Marketing Campaign',
      description: 'Looking for a social media marketer to create and manage a 3-month marketing campaign across Instagram, Facebook, and Twitter.',
      budget: 3000,
      deadline: '2025-09-15',
      location: 'Remote',
      category: 'Digital Marketing',
      status: 'draft',
      proposals: 0,
      postedDate: '2025-06-10',
    },
  ];

  // Filter jobs based on active tab
  const filteredJobs = jobs.filter(job => job.status === activeTab);

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'active': return 'default';
      case 'completed': return 'success';
      case 'draft': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <UnifiedDashboardLayout title="My Jobs" showMap={false}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Jobs</h1>
              <p className="text-muted-foreground">Manage your job postings and proposals</p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="icon" className="bg-white/20 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30">
                <Filter className="h-5 w-5" />
              </Button>
              <Button asChild>
                <Link href="/jobs/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a New Job
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Jobs Tabs */}
          <GlassCard className="mb-6" intensity="low">
            <GlassCardContent className="p-0">
              <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 rounded-none bg-transparent">
                  <TabsTrigger value="active" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/30">
                    Active Jobs
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/30">
                    Completed Jobs
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-gray-800/30">
                    Draft Jobs
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </GlassCardContent>
          </GlassCard>
          
          {/* Jobs Content */}
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <GlassCard key={job.id} intensity="medium">
                  <GlassCardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <GlassCardTitle className="text-xl">{job.title}</GlassCardTitle>
                        <div className="mt-1 flex items-center flex-wrap gap-2">
                          <Badge variant="outline" className="bg-white/10 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30">
                            {job.category}
                          </Badge>
                          <span className="text-muted-foreground text-sm">Posted on {job.postedDate}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={getStatusVariant(job.status)}
                        className={job.status === 'active' 
                          ? 'bg-brand-500/80 hover:bg-brand-500/70' 
                          : job.status === 'completed' 
                          ? 'bg-green-500/80 hover:bg-green-500/70' 
                          : 'bg-white/20 dark:bg-gray-800/40 hover:bg-white/30 dark:hover:bg-gray-800/50'
                        }
                      >
                        {job.status === 'active' ? 'Active' : job.status === 'completed' ? 'Completed' : 'Draft'}
                      </Badge>
                    </div>
                  </GlassCardHeader>
                  
                  <GlassCardContent>
                    <p className="text-sm mb-4">{job.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-white/10 dark:bg-gray-800/20 mr-3">
                          <DollarSign className="h-4 w-4 text-brand-500" />
                        </div>
                        <span>Budget: ${job.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-white/10 dark:bg-gray-800/20 mr-3">
                          <Calendar className="h-4 w-4 text-brand-500" />
                        </div>
                        <span>Deadline: {job.deadline}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-white/10 dark:bg-gray-800/20 mr-3">
                          <MapPin className="h-4 w-4 text-brand-500" />
                        </div>
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </GlassCardContent>
                  
                  <GlassCardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.proposals} proposals received
                    </div>
                    <div className="space-x-2">
                      {job.status === 'draft' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/10 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30"
                        >
                          Edit Draft
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-white/10 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30 gap-1"
                        asChild
                      >
                        <Link href={`/jobs/${job.id}`}>
                          View Details <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </GlassCardFooter>
                </GlassCard>
              ))
            ) : (
              <GlassCard intensity="low">
                <GlassCardContent className="text-center py-12">
                  <h3 className="text-lg font-medium">No {activeTab} jobs found</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'active' 
                      ? "You don't have any active jobs. Post a new job to get started." 
                      : activeTab === 'completed'
                      ? "You don't have any completed jobs yet."
                      : "You don't have any draft jobs. Start creating a new job posting."}
                  </p>
                  {(activeTab === 'active' || activeTab === 'draft') && (
                    <Button className="mt-4" asChild>
                      <Link href="/jobs/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post a New Job
                      </Link>
                    </Button>
                  )}
                </GlassCardContent>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
