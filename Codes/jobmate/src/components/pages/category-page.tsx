"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JOB_CATEGORIES, findCategoryBySubcategory, getSubcategoryById } from '@/data/job-categories';
import { JobCategoryIcon } from '@/components/ui/job-category-icon';
import { Search, ChevronRight, Filter, Star, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getInitials } from '@/lib/utils';

interface CategoryPageProps {
  categoryId: string;
  subcategoryId?: string;
}

// Mock service providers
const mockProviders = [
  {
    id: '1',
    name: 'John Doe',
    avatar: '',
    title: 'Professional Plumber',
    rating: 4.9,
    reviewCount: 124,
    hourlyRate: 45,
    location: 'New York, NY',
    distance: '2.3 miles away',
    availability: 'Available today',
    verified: true,
    description: 'Experienced plumber with over 10 years in residential and commercial plumbing services.',
    tags: ['Emergency Repairs', 'Installation', 'Maintenance']
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: '',
    title: 'Master Electrician',
    rating: 4.8,
    reviewCount: 98,
    hourlyRate: 55,
    location: 'Brooklyn, NY',
    distance: '3.5 miles away',
    availability: 'Available tomorrow',
    verified: true,
    description: 'Licensed master electrician specializing in residential wiring and smart home installations.',
    tags: ['Electrical Repairs', 'Smart Home', 'Lighting']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: '',
    title: 'Handyman Services',
    rating: 4.7,
    reviewCount: 87,
    hourlyRate: 35,
    location: 'Queens, NY',
    distance: '5.1 miles away',
    availability: 'Available in 3 days',
    verified: false,
    description: 'General handyman offering a wide range of home repair and maintenance services.',
    tags: ['Furniture Assembly', 'Minor Repairs', 'Mounting']
  },
  {
    id: '4',
    name: 'Sarah Williams',
    avatar: '',
    title: 'Professional Cleaner',
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 30,
    location: 'Manhattan, NY',
    distance: '1.8 miles away',
    availability: 'Available today',
    verified: true,
    description: 'Thorough and detail-oriented house cleaner with eco-friendly cleaning options.',
    tags: ['Deep Cleaning', 'Move-in/out', 'Regular Cleaning']
  },
  {
    id: '5',
    name: 'David Brown',
    avatar: '',
    title: 'HVAC Technician',
    rating: 4.6,
    reviewCount: 72,
    hourlyRate: 60,
    location: 'Bronx, NY',
    distance: '6.2 miles away',
    availability: 'Available tomorrow',
    verified: true,
    description: 'Certified HVAC technician specializing in installation, repair, and maintenance of all heating and cooling systems.',
    tags: ['AC Repair', 'Heating Systems', 'Maintenance']
  },
  {
    id: '6',
    name: 'Lisa Garcia',
    avatar: '',
    title: 'Interior Painter',
    rating: 4.8,
    reviewCount: 91,
    hourlyRate: 40,
    location: 'Staten Island, NY',
    distance: '8.7 miles away',
    availability: 'Available next week',
    verified: false,
    description: 'Professional painter with an eye for detail and color. Specializing in interior painting and decorative finishes.',
    tags: ['Interior Painting', 'Color Consultation', 'Wallpaper']
  }
];

export function CategoryPage({ categoryId, subcategoryId }: CategoryPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [availabilityFilter, setAvailabilityFilter] = useState('any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [providers, setProviders] = useState(mockProviders);
  
  // Find the current category
  const category = JOB_CATEGORIES.find(cat => cat.id === categoryId);
  const subcategory = subcategoryId ? getSubcategoryById(subcategoryId) : undefined;
  
  useEffect(() => {
    // Filter providers based on filters
    let filtered = [...mockProviders];
    
    if (searchQuery) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (verifiedOnly) {
      filtered = filtered.filter(provider => provider.verified);
    }
    
    if (availabilityFilter !== 'any') {
      filtered = filtered.filter(provider => {
        if (availabilityFilter === 'today') {
          return provider.availability.includes('today');
        } else if (availabilityFilter === 'tomorrow') {
          return provider.availability.includes('tomorrow') || provider.availability.includes('today');
        }
        return true;
      });
    }
    
    filtered = filtered.filter(provider => 
      provider.hourlyRate >= priceRange[0] && provider.hourlyRate <= priceRange[1]
    );
    
    // Sort providers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.hourlyRate - b.hourlyRate;
        case 'price-high':
          return b.hourlyRate - a.hourlyRate;
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return 0; // recommended - could be more complex in real implementation
      }
    });
    
    setProviders(filtered);
  }, [searchQuery, sortBy, priceRange, availabilityFilter, verifiedOnly]);
  
  if (!category) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button onClick={() => router.push('/marketplace')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 hover:bg-transparent"
            onClick={() => router.push('/marketplace')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{subcategory ? subcategory.name : category.name}</h1>
              <p className="text-muted-foreground">
                {subcategory 
                  ? `${category.name} > ${subcategory.name}` 
                  : `${category.subcategories.length} services available`
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Filters sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">Price Range (hourly)</h3>
                <div className="space-y-3">
                  <Slider 
                    defaultValue={[0, 100]} 
                    max={200} 
                    step={5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>
              </div>
              
              {/* Availability */}
              <div>
                <h3 className="font-medium mb-2">Availability</h3>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="today">Available today</SelectItem>
                    <SelectItem value="tomorrow">Available this week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Verified Providers */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verified" 
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                />
                <Label htmlFor="verified">Verified providers only</Label>
              </div>
              
              {/* Subcategories */}
              {!subcategoryId && (
                <div>
                  <h3 className="font-medium mb-2">Services</h3>
                  <div className="space-y-2">
                    {category.subcategories.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="flex items-center justify-between cursor-pointer hover:text-brand-600"
                        onClick={() => router.push(`/marketplace/${categoryId}/${sub.id}`)}
                      >
                        <span>{sub.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Search and sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search providers..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Results */}
            {providers.length > 0 ? (
              <div className="space-y-6">
                {providers.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Provider info */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={provider.avatar} alt={provider.name} />
                            <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{provider.name}</h3>
                              {provider.verified && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground">{provider.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                              <span className="font-medium">{provider.rating}</span>
                              <span className="text-sm text-muted-foreground">({provider.reviewCount} reviews)</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {provider.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Details and booking */}
                        <div className="flex-grow mt-4 md:mt-0">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span>{provider.location}</span>
                                <span className="text-muted-foreground">({provider.distance})</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{provider.availability}</span>
                              </div>
                              <p className="text-sm mt-3">{provider.description}</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                              <p className="text-xl font-bold">${provider.hourlyRate}/hr</p>
                              <Button className="mt-2">Book Now</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-lg text-muted-foreground mb-2">No service providers found matching your criteria.</p>
                <Button variant="link" onClick={() => {
                  setSearchQuery('');
                  setPriceRange([0, 100]);
                  setAvailabilityFilter('any');
                  setVerifiedOnly(false);
                }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CategoryPage;
