"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardContent,
  GlassCardFooter
} from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JOB_CATEGORIES } from '@/data/job-categories';
import { JobCategoryIcon } from '@/components/ui/job-category-icon';
import { Search, ChevronRight, TrendingUp, Clock, Star, Filter, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UnifiedMarketplacePage() {
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
    <UnifiedDashboardLayout title="Marketplace" showMap={false}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
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
          <GlassCard className="mb-8" intensity="low">
            <GlassCardContent className="p-3">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    placeholder="Search for services or job categories..." 
                    className="pl-10 h-12 text-lg bg-white/20 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2 bg-white/20 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </GlassCardContent>
          </GlassCard>
          
          {/* Featured Categories Section */}
          {searchQuery === '' && (
            <GlassCard className="mb-8" intensity="medium">
              <GlassCardHeader>
                <GlassCardTitle>Featured Categories</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {JOB_CATEGORIES.slice(0, 6).map((category) => (
                    <div 
                      key={category.id}
                      className="flex flex-col items-center p-4 rounded-lg bg-white/10 dark:bg-gray-800/20 hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
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
              </GlassCardContent>
            </GlassCard>
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
                    <GlassCard 
                      key={category.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      intensity="medium"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <GlassCardHeader>
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{category.icon}</div>
                          <GlassCardTitle>{category.name}</GlassCardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </GlassCardHeader>
                      <GlassCardContent>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 5).map((subcategory) => (
                            <Badge 
                              key={subcategory.id} 
                              variant="outline" 
                              className="cursor-pointer hover:bg-white/20 dark:hover:bg-gray-800/30 border-white/10 dark:border-gray-700/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubcategoryClick(category.id, subcategory.id);
                              }}
                            >
                              {subcategory.name}
                            </Badge>
                          ))}
                          {category.subcategories.length > 5 && (
                            <Badge variant="outline" className="bg-white/5 dark:bg-gray-800/10 border-white/10 dark:border-gray-700/30">
                              +{category.subcategories.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </GlassCardContent>
                      <GlassCardFooter className="flex justify-end">
                        <Button variant="ghost" size="sm" className="gap-1">
                          View All <ChevronRight className="h-4 w-4" />
                        </Button>
                      </GlassCardFooter>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard intensity="low">
                  <GlassCardContent className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No categories found matching your search.</p>
                    <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                  </GlassCardContent>
                </GlassCard>
              )}
            </TabsContent>
            
            <TabsContent value="trending" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Trending services would be dynamically loaded here */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <GlassCard key={i} className="hover:shadow-lg transition-shadow" intensity="medium">
                    <GlassCardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <GlassCardTitle className="text-lg">Trending Service {i}</GlassCardTitle>
                        <TrendingUp className="h-5 w-5 text-brand-600" />
                      </div>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <div className="h-32 bg-white/10 dark:bg-gray-800/20 rounded-md mb-3"></div>
                      <p className="text-sm text-muted-foreground">Popular service with high demand</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>P{i}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Provider {i}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium">4.8</span>
                          <span className="text-xs text-muted-foreground">(120)</span>
                        </div>
                      </div>
                    </GlassCardContent>
                    <GlassCardFooter className="flex justify-between items-center">
                      <Badge className="bg-white/10 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30">
                        From $25/hr
                      </Badge>
                      <Button size="sm" variant="outline" className="gap-1">
                        View <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </GlassCardFooter>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recommended" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Recommended services would be dynamically loaded here */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <GlassCard key={i} className="hover:shadow-lg transition-shadow" intensity="medium">
                    <GlassCardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <GlassCardTitle className="text-lg">Recommended Service {i}</GlassCardTitle>
                        <Star className="h-5 w-5 text-brand-600" />
                      </div>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <div className="h-32 bg-white/10 dark:bg-gray-800/20 rounded-md mb-3"></div>
                      <p className="text-sm text-muted-foreground">Based on your profile and activity</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Recently viewed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>
                    </GlassCardContent>
                    <GlassCardFooter className="flex justify-between items-center">
                      <Badge className="bg-white/10 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30">
                        From $30/hr
                      </Badge>
                      <Button size="sm" variant="outline" className="gap-1">
                        View <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </GlassCardFooter>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
