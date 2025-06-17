"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface WorkItem {
  id: string;
  jobTitle: string;
  jobId: string;
  category: string;
  completedDate: string;
  duration: string; // e.g. "2 hours", "3 days"
  rating: number;
  review?: string;
  customerName: string;
  customerImage?: string;
  beforeImages: string[];
  afterImages: string[];
}

interface WorkTrailProps {
  specialistId: string;
  workItems: WorkItem[];
}

export function WorkTrail({ specialistId, workItems }: WorkTrailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'before_after' | 'timeline'>('before_after');
  
  // Get current work item
  const currentItem = workItems[currentIndex];
  
  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? workItems.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === workItems.length - 1 ? 0 : prev + 1));
  };
  
  // Format rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };
  
  if (workItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No work history available yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Trail</h3>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'before_after' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('before_after')}
          >
            Before/After
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </Button>
        </div>
      </div>
      
      {viewMode === 'before_after' ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {/* Before/After Image Gallery */}
              <div className="grid grid-cols-2 gap-1 aspect-video">
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Before
                  </div>
                  {currentItem.beforeImages.length > 0 ? (
                    <img
                      src={currentItem.beforeImages[0]}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">No image</p>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    After
                  </div>
                  {currentItem.afterImages.length > 0 ? (
                    <img
                      src={currentItem.afterImages[0]}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">No image</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              {workItems.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              {/* Pagination Dots */}
              {workItems.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {workItems.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full ${
                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Job Details */}
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-medium">{currentItem.jobTitle}</h4>
                <Badge variant="outline" className="mt-1">
                  {currentItem.category}
                </Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {currentItem.completedDate}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentItem.duration}
                </div>
              </div>
              
              {/* Customer Review */}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={currentItem.customerImage} alt={currentItem.customerName} />
                      <AvatarFallback className="text-xs">
                        {getInitials(currentItem.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{currentItem.customerName}</span>
                  </div>
                  <div className="flex">{renderStars(currentItem.rating)}</div>
                </div>
                
                {currentItem.review && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "{currentItem.review}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workItems.map((item, index) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center border-2 border-brand-500">
                      <CheckCircle className="h-4 w-4 text-brand-500" />
                    </div>
                    {index < workItems.length - 1 && (
                      <div className="h-full w-0.5 bg-brand-200 my-1" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-medium">{item.jobTitle}</h4>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                        <div className="flex">{renderStars(item.rating)}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.completedDate}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.duration}
                      </div>
                    </div>
                    
                    {item.review && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={item.customerImage} alt={item.customerName} />
                            <AvatarFallback className="text-xs">
                              {getInitials(item.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{item.customerName}</span>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          "{item.review}"
                        </p>
                      </div>
                    )}
                    
                    {/* Thumbnail Images */}
                    {(item.beforeImages.length > 0 || item.afterImages.length > 0) && (
                      <div className="flex space-x-2 overflow-x-auto py-1">
                        {item.beforeImages.map((img, i) => (
                          <div key={`before-${i}`} className="relative flex-shrink-0">
                            <img
                              src={img}
                              alt={`Before ${i + 1}`}
                              className="h-16 w-16 object-cover rounded"
                            />
                            <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded">
                              Before
                            </div>
                          </div>
                        ))}
                        {item.afterImages.map((img, i) => (
                          <div key={`after-${i}`} className="relative flex-shrink-0">
                            <img
                              src={img}
                              alt={`After ${i + 1}`}
                              className="h-16 w-16 object-cover rounded"
                            />
                            <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded">
                              After
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
