"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, MapPin, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function JobsPage() {
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

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <Button asChild>
            <Link href="/jobs/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a New Job
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
            <TabsTrigger value="draft">Draft Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="outline" className="mr-2">{job.category}</Badge>
                          <span className="text-muted-foreground text-sm">Posted on {job.postedDate}</span>
                        </CardDescription>
                      </div>
                      <Badge variant={job.status === 'active' ? 'default' : job.status === 'completed' ? 'success' : 'secondary'}>
                        {job.status === 'active' ? 'Active' : job.status === 'completed' ? 'Completed' : 'Draft'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm mb-4">{job.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Budget: ${job.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Deadline: {job.deadline}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {job.proposals} proposals received
                    </div>
                    <div className="space-x-2">
                      {job.status === 'draft' && (
                        <Button variant="outline" size="sm">Edit Draft</Button>
                      )}
                      <Button size="sm" asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
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
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
