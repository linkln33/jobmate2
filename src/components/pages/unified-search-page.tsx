"use client";

import { useState } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Search, MapPin, Filter, ChevronDown, Briefcase, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function UnifiedSearchPage() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('rating');
  
  // Mock specialists data
  const specialists = [
    {
      id: 1,
      name: 'John Doe',
      avatar: '',
      title: 'Senior Web Developer',
      rating: 4.9,
      reviews: 124,
      hourlyRate: 85,
      location: 'New York, USA',
      skills: ['React', 'Node.js', 'TypeScript', 'Next.js'],
      description: 'Full-stack developer with 8+ years of experience specializing in React and Node.js applications. I create responsive, user-friendly web applications with clean code and modern best practices.',
      completedJobs: 78,
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: '',
      title: 'UI/UX Designer',
      rating: 4.8,
      reviews: 98,
      hourlyRate: 75,
      location: 'San Francisco, USA',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research'],
      description: 'Creative UI/UX designer focused on creating beautiful, intuitive interfaces. I combine aesthetics with functionality to deliver exceptional user experiences.',
      completedJobs: 65,
    },
    {
      id: 3,
      name: 'Michael Johnson',
      avatar: '',
      title: 'DevOps Engineer',
      rating: 4.7,
      reviews: 87,
      hourlyRate: 90,
      location: 'Austin, USA',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      description: 'DevOps specialist with expertise in cloud infrastructure, containerization, and automation. I help teams build robust, scalable deployment pipelines.',
      completedJobs: 54,
    },
    {
      id: 4,
      name: 'Emily Chen',
      avatar: '',
      title: 'Mobile App Developer',
      rating: 4.9,
      reviews: 112,
      hourlyRate: 80,
      location: 'Seattle, USA',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      description: 'Mobile developer specializing in cross-platform applications. I build high-performance, native-feeling apps for both iOS and Android platforms.',
      completedJobs: 92,
    },
  ];
  
  // Mock jobs data
  const jobs = [
    {
      id: 1,
      title: 'React Developer Needed for E-commerce Project',
      company: 'TechCorp Inc.',
      location: 'Remote',
      type: 'Contract',
      duration: '3 months',
      budget: '$5,000 - $8,000',
      postedDate: '2 days ago',
      skills: ['React', 'Redux', 'TypeScript', 'Tailwind CSS'],
      description: 'We are looking for an experienced React developer to help build our new e-commerce platform. The ideal candidate should have strong experience with modern React practices, state management, and responsive design.',
    },
    {
      id: 2,
      title: 'UI/UX Designer for Mobile Banking App',
      company: 'FinTech Solutions',
      location: 'New York, USA',
      type: 'Full-time',
      duration: 'Permanent',
      budget: '$90,000 - $110,000/year',
      postedDate: '1 week ago',
      skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
      description: 'FinTech Solutions is seeking a talented UI/UX designer to reimagine our mobile banking experience. You will work closely with product managers and developers to create intuitive, secure, and beautiful interfaces.',
    },
    {
      id: 3,
      title: 'DevOps Engineer for Cloud Migration',
      company: 'CloudScale Systems',
      location: 'Remote',
      type: 'Contract',
      duration: '6 months',
      budget: '$70 - $90/hour',
      postedDate: '3 days ago',
      skills: ['AWS', 'Terraform', 'Docker', 'CI/CD'],
      description: 'We need a DevOps engineer to help migrate our infrastructure to AWS. The project involves setting up a new cloud architecture, implementing IaC, and establishing robust CI/CD pipelines.',
    },
    {
      id: 4,
      title: 'Full Stack Developer for Healthcare Platform',
      company: 'MedTech Innovations',
      location: 'Boston, USA',
      type: 'Full-time',
      duration: 'Permanent',
      budget: '$100,000 - $130,000/year',
      postedDate: '5 days ago',
      skills: ['Node.js', 'React', 'MongoDB', 'GraphQL'],
      description: 'MedTech Innovations is building a next-generation healthcare platform to connect patients with providers. We need a full stack developer who can work on both frontend and backend components.',
    },
  ];
  
  return (
    <UnifiedDashboardLayout title="Search" showMap={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search for jobs, skills, or specialists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md"
              />
            </div>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
                <Filter size={18} className="mr-2" /> Filters
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-sm">
              Remote
            </Badge>
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-sm">
              Full-time
            </Badge>
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-sm">
              $50-100/hr
            </Badge>
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-sm">
              React
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              + Add Filter
            </Badge>
          </div>
        </div>
        
        {/* Search Results */}
        <Tabs defaultValue="specialists" className="mb-8">
          <TabsList className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
            <TabsTrigger value="specialists">Specialists</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specialists">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialists.map((specialist) => (
                <Card key={specialist.id} className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={specialist.avatar} alt={specialist.name} />
                        <AvatarFallback className="bg-gradient-to-r from-brand-500 to-blue-500 text-white">
                          {getInitials(specialist.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{specialist.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{specialist.title}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-medium">{specialist.rating}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">({specialist.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{specialist.location}</span>
                          <span className="mx-2">•</span>
                          <span>${specialist.hourlyRate}/hr</span>
                        </div>
                        
                        <p className="mt-3 text-sm line-clamp-2">{specialist.description}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {specialist.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                              {skill}
                            </Badge>
                          ))}
                          {specialist.skills.length > 3 && (
                            <Badge variant="outline">+{specialist.skills.length - 3}</Badge>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{specialist.completedJobs} jobs completed</span>
                          </div>
                          <Button asChild size="sm" className="bg-gradient-to-r from-brand-500 to-blue-500 hover:from-brand-600 hover:to-blue-600">
                            <Link href={`/specialists/${specialist.id}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="jobs">
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{job.company}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-brand-500 to-blue-500 text-white">
                        {job.type}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{job.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Posted {job.postedDate}</span>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-sm line-clamp-2">{job.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-brand-600 dark:text-brand-400 font-medium">
                        {job.budget}
                      </div>
                      <Button asChild size="sm" className="bg-gradient-to-r from-brand-500 to-blue-500 hover:from-brand-600 hover:to-blue-600">
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-gradient-to-r from-brand-500 to-blue-500 text-white">
              1
            </Button>
            <Button variant="outline" size="sm" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
              2
            </Button>
            <Button variant="outline" size="sm" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
              3
            </Button>
            <Button variant="outline" size="sm" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
              Next
            </Button>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
