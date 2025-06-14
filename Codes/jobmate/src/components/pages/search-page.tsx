"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
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

interface SearchPageProps {
  isAuthenticated: boolean;
  user: any;
}

export function SearchPage({ isAuthenticated, user }: SearchPageProps) {
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
      location: 'London, UK',
      skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
      description: 'Creative UI/UX designer with a passion for creating beautiful, intuitive interfaces. I focus on user-centered design principles to deliver exceptional user experiences.',
      completedJobs: 65,
    },
    {
      id: 3,
      name: 'Michael Johnson',
      avatar: '',
      title: 'Mobile App Developer',
      rating: 4.7,
      reviews: 87,
      hourlyRate: 90,
      location: 'San Francisco, USA',
      skills: ['React Native', 'iOS', 'Android', 'Flutter'],
      description: 'Experienced mobile developer specializing in cross-platform applications. I build high-performance, feature-rich mobile apps for both iOS and Android platforms.',
      completedJobs: 54,
    },
    {
      id: 4,
      name: 'Sarah Williams',
      avatar: '',
      title: 'Digital Marketing Specialist',
      rating: 4.9,
      reviews: 112,
      hourlyRate: 65,
      location: 'Toronto, Canada',
      skills: ['SEO', 'Content Marketing', 'Social Media', 'PPC'],
      description: 'Results-driven digital marketer with expertise in SEO, content strategy, and social media marketing. I help businesses increase their online visibility and drive conversions.',
      completedJobs: 92,
    },
    {
      id: 5,
      name: 'David Chen',
      avatar: '',
      title: 'Data Scientist',
      rating: 4.8,
      reviews: 76,
      hourlyRate: 95,
      location: 'Berlin, Germany',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
      description: 'Data scientist with a background in machine learning and statistical analysis. I help businesses extract meaningful insights from their data and build predictive models.',
      completedJobs: 48,
    },
  ];

  // Mock categories
  const categories = [
    { id: 'web-dev', name: 'Web Development' },
    { id: 'mobile-dev', name: 'Mobile Development' },
    { id: 'design', name: 'Design' },
    { id: 'writing', name: 'Content Writing' },
    { id: 'marketing', name: 'Digital Marketing' },
    { id: 'data', name: 'Data Science' },
    { id: 'other', name: 'Other' },
  ];

  // Filter specialists based on search query and filters
  let filteredSpecialists = specialists.filter((specialist) => {
    // Filter by search query
    const matchesQuery = specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = category === 'all' || !category || specialist.skills.some(skill => {
      const categoryMap: Record<string, string[]> = {
        'web-dev': ['React', 'Node.js', 'TypeScript', 'Next.js', 'JavaScript'],
        'mobile-dev': ['React Native', 'iOS', 'Android', 'Flutter'],
        'design': ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
        'marketing': ['SEO', 'Content Marketing', 'Social Media', 'PPC'],
        'data': ['Python', 'Machine Learning', 'Data Analysis', 'SQL']
      };
      
      return categoryMap[category]?.includes(skill);
    });
    
    // Filter by price range
    const matchesPrice = specialist.hourlyRate >= priceRange[0] && 
      specialist.hourlyRate <= priceRange[1] * 2;
    
    return matchesQuery && matchesCategory && matchesPrice;
  });
  
  // Sort specialists based on selected sort option
  filteredSpecialists = [...filteredSpecialists].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.hourlyRate - b.hourlyRate;
      case 'price-high':
        return b.hourlyRate - a.hourlyRate;
      case 'jobs':
        return b.completedJobs - a.completedJobs;
      default:
        return 0;
    }
  });

  // Mock job offers data
  const jobOffers = [
    {
      id: 101,
      title: 'Website Redesign Project',
      description: 'Looking for an experienced web developer to redesign our company website with modern design and improved functionality.',
      budget: '$2000-$3000',
      duration: '2-3 weeks',
      skills: ['React', 'UI/UX', 'Responsive Design'],
      postedBy: 'TechCorp Inc.',
      postedDate: '2 days ago',
      location: 'Remote',
      status: 'Open'
    },
    {
      id: 102,
      title: 'Mobile App Development',
      description: 'Need a skilled mobile developer to create a delivery tracking app for iOS and Android platforms.',
      budget: '$4000-$6000',
      duration: '1-2 months',
      skills: ['React Native', 'iOS', 'Android', 'API Integration'],
      postedBy: 'LogiTech Solutions',
      postedDate: '5 days ago',
      location: 'Remote',
      status: 'Open'
    },
    {
      id: 103,
      title: 'E-commerce Platform Integration',
      description: 'Seeking developer to integrate payment gateways and shipping APIs into our existing e-commerce platform.',
      budget: '$1500-$2500',
      duration: '2 weeks',
      skills: ['API', 'Payment Gateways', 'E-commerce', 'JavaScript'],
      postedBy: 'ShopEasy',
      postedDate: '1 week ago',
      location: 'Remote',
      status: 'Open'
    },
    {
      id: 104,
      title: 'Data Visualization Dashboard',
      description: 'Create an interactive dashboard to visualize sales and marketing data with filtering capabilities.',
      budget: '$3000-$4000',
      duration: '3-4 weeks',
      skills: ['D3.js', 'React', 'Data Visualization', 'Charts'],
      postedBy: 'DataInsight Co.',
      postedDate: '3 days ago',
      location: 'Remote',
      status: 'Open'
    },
    {
      id: 105,
      title: 'SEO Optimization Project',
      description: 'Improve our website SEO ranking through technical optimization and content strategy.',
      budget: '$1000-$2000',
      duration: 'Ongoing',
      skills: ['SEO', 'Content Marketing', 'Analytics'],
      postedBy: 'GrowthHackers',
      postedDate: '4 days ago',
      location: 'Remote',
      status: 'Open'
    },
  ];
  
  // Filter job offers based on search query and filters
  const filteredJobOffers = jobOffers.filter((job) => {
    // Filter by search query
    const matchesQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = category === 'all' || !category || job.skills.some(skill => {
      const categoryMap: Record<string, string[]> = {
        'web-dev': ['React', 'Node.js', 'TypeScript', 'Next.js', 'JavaScript'],
        'mobile-dev': ['React Native', 'iOS', 'Android', 'Flutter'],
        'design': ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
        'marketing': ['SEO', 'Content Marketing', 'Social Media', 'PPC'],
        'data': ['Data Visualization', 'Analytics', 'Charts']
      };
      
      return categoryMap[category]?.includes(skill);
    });
    
    return matchesQuery && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Marketplace Tabs */}
        <Tabs defaultValue="services" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="jobs">Job Offers</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Search and filters */}
          <div className="mb-8">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Search */}
                  <div className="relative w-full md:w-1/4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search by name, skill, or job title..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="w-full md:w-1/5">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sort */}
                  <div className="w-full md:w-1/5">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="jobs">Most Jobs Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Price Range */}
                  <div className="flex items-center w-full md:w-1/3 gap-3">
                    <div className="text-sm whitespace-nowrap">Hourly Rate: ${priceRange[0]} - ${priceRange[1] * 2}</div>
                    <div className="flex-1">
                      <Slider
                        defaultValue={[0, 50]}
                        max={100}
                        step={1}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                  </div>
                  
                  {/* Reset */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full md:w-auto" 
                    onClick={() => {
                      setSearchQuery('');
                      setCategory('all');
                      setPriceRange([0, 100]);
                      setSortBy('rating');
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tab Contents */}
          <TabsContent value="services">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {filteredSpecialists.length} specialists found
                </p>
              </div>
              
              {/* Specialists grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpecialists.map((specialist) => (
                  <Card key={specialist.id} className="overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={specialist.avatar} />
                            <AvatarFallback className="bg-brand-100 text-brand-800">
                              {getInitials(specialist.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{specialist.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{specialist.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{specialist.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({specialist.reviews})</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-1">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {specialist.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {specialist.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{specialist.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2">{specialist.description}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <span className="font-bold">${specialist.hourlyRate}</span>
                        <span className="text-sm text-muted-foreground">/hr</span>
                      </div>
                      <Button size="sm">View Profile</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredSpecialists.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No specialists found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery('');
                    setCategory('all');
                    setPriceRange([0, 100]);
                    setSortBy('rating');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="jobs">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {filteredJobOffers.length} job offers found
                </p>
              </div>
              
              {/* Job Offers grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobOffers.map((job) => (
                  <Card key={job.id} className="overflow-hidden flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            Posted by {job.postedBy} · {job.postedDate}
                          </CardDescription>
                        </div>
                        <Badge>{job.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-1">
                      <p className="text-sm mb-4 line-clamp-2">{job.description}</p>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Budget:</span> {job.budget}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span> {job.duration}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location:</span> {job.location}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2 border-t">
                      <Button size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredJobOffers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No job offers found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery('');
                    setCategory('all');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
