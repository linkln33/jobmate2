"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, MapPin, Star, Briefcase, Clock, Calendar, Filter } from 'lucide-react';

// Algolia imports
import { InstantSearch, Configure, RefinementList } from 'react-instantsearch';
import { searchClient } from '@/utils/algolia';
import { AlgoliaSearchBar } from '@/components/search/algolia-search-bar';
import { SpecialistsHits } from '@/components/search/specialists-hits';
import { JobsHits } from '@/components/search/jobs-hits';
import { MARKETPLACE_CATEGORIES } from '@/data/marketplace-categories';

// Mock auth hook until real implementation is available
function useAuth() {
  return {
    isAuthenticated: true,
    user: {
      name: 'Demo User',
      email: 'user@example.com',
      avatar: ''
    }
  };
}

// Helper function to get initials from name
const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Helper function to format date
function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Less than a day
  if (diff < 86400000) {
    return 'Today';
  }
  // Less than a week
  else if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  // Less than a month
  else if (diff < 2592000000) {
    const weeks = Math.floor(diff / 604800000);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  // More than a month
  else {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
}

export function UnifiedSearchPage() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('specialists');
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
    <InstantSearch searchClient={searchClient} indexName="jobmate_listings">
      <Configure hitsPerPage={12} distinct={true} />
      <UnifiedDashboardLayout title="Search" showMap={false}>
        <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <AlgoliaSearchBar />
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[220px] bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {MARKETPLACE_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
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
        <Tabs defaultValue="specialists" className="mb-8" onValueChange={(value) => {
          // When tab changes, update the Algolia index being searched
          const indexName = value === 'specialists' ? 'jobmate_specialists' : 'jobmate_listings';
          // This would normally update the index, but we'll keep it simple for now
        }}>
          <TabsList className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md">
            <TabsTrigger value="specialists">Specialists</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specialists">
            {/* Algolia-powered specialists results */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  <RefinementList
                    attribute="category"
                    limit={5}
                    operator="or"
                    className="hidden"
                  />
                </h3>
              </div>
            </div>
            <SpecialistsHits />
          </TabsContent>
          
          <TabsContent value="jobs">
            {/* Algolia-powered jobs results */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  <RefinementList
                    attribute="jobType"
                    limit={5}
                    operator="or"
                    className="hidden"
                  />
                </h3>
              </div>
            </div>
            <JobsHits />
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
    </InstantSearch>
  );
}
