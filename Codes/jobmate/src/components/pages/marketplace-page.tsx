"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JOB_CATEGORIES } from '@/data/job-categories';
import { JobCategoryIcon } from '@/components/ui/job-category-icon';
import { Search, ChevronRight, TrendingUp, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  
  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? JOB_CATEGORIES.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subcategories.some(sub => 
          sub.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : JOB_CATEGORIES;
  
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/marketplace/${categoryId}`);
  };
  
  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    router.push(`/marketplace/${categoryId}/${subcategoryId}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Find services or post jobs across various categories</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => router.push('/post-job')}>
            Post a Job
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Search for services or job categories..." 
            className="pl-10 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Featured Categories Section */}
        {searchQuery === '' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {JOB_CATEGORIES.slice(0, 6).map((category) => (
                <div 
                  key={category.id}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-medium text-center">{category.name}</h3>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {category.subcategories.length} services
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Marketplace Tabs */}
        <Tabs defaultValue="browse" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="browse">Browse Categories</TabsTrigger>
            <TabsTrigger value="trending">Trending Services</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="mt-6">
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Card 
                    key={category.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{category.icon}</div>
                        <CardTitle>{category.name}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.slice(0, 5).map((subcategory) => (
                          <Badge 
                            key={subcategory.id} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategoryClick(category.id, subcategory.id);
                            }}
                          >
                            {subcategory.name}
                          </Badge>
                        ))}
                        {category.subcategories.length > 5 && (
                          <Badge variant="outline" className="bg-muted">
                            +{category.subcategories.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View All <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No categories found matching your search.</p>
                <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trending services would be dynamically loaded here */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Trending Service {i}</CardTitle>
                      <TrendingUp className="h-5 w-5 text-brand-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Popular service with high demand</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-xs text-muted-foreground">(120 reviews)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Badge>From $25/hr</Badge>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recommended services would be dynamically loaded here */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Recommended Service {i}</CardTitle>
                      <Star className="h-5 w-5 text-brand-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Based on your profile and activity</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Recently viewed</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Badge>From $30/hr</Badge>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        

      </div>
    </MainLayout>
  );
}

export default MarketplacePage;
