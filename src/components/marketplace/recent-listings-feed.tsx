"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, Clock, Tag, ExternalLink } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace';

interface RecentListingsFeedProps {
  listings: MarketplaceListing[];
  title?: string;
  maxItems?: number;
}

export function RecentListingsFeed({ 
  listings, 
  title = "Recent Listings", 
  maxItems = 5 
}: RecentListingsFeedProps) {
  const router = useRouter();
  const [visibleListings, setVisibleListings] = useState(maxItems);
  
  // Sort listings by date (newest first)
  const sortedListings = [...listings].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  
  // Get only the most recent listings based on visibleListings count
  const recentListings = sortedListings.slice(0, visibleListings);
  
  // Format price with currency
  const formatPrice = (price: number, priceUnit?: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    
    return priceUnit ? `${formattedPrice}/${priceUnit}` : formattedPrice;
  };
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };
  
  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'job':
        return 'bg-blue-500 text-white';
      case 'service':
        return 'bg-purple-500 text-white';
      case 'item':
        return 'bg-green-500 text-white';
      case 'rental':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Handle view details click
  const handleViewDetails = (listing: MarketplaceListing) => {
    router.push(`/marketplace/listing/${listing.id}`);
  };
  
  // Handle load more
  const handleLoadMore = () => {
    setVisibleListings(prev => prev + maxItems);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/marketplace')}
          className="text-sm"
        >
          View All
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentListings.map(listing => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-base line-clamp-1">{listing.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge className={getTypeBadgeColor(listing.type)}>
                      {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                    </Badge>
                    {listing.isVerified && (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    {formatPrice(listing.price, listing.priceUnit)}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                {listing.description}
              </p>
              
              <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                {listing.address && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{listing.address}</span>
                  </div>
                )}
                
                {listing.createdAt && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{formatRelativeTime(listing.createdAt)}</span>
                  </div>
                )}
                
                {listing.tags && listing.tags.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1 mt-1">
                    <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                    {listing.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {listing.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{listing.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="p-3 pt-0 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
              {listing.seller && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center text-xs font-medium uppercase">
                      {listing.seller.name ? listing.seller.name.charAt(0) : 'U'}
                    </div>
                  </Avatar>
                  <span className="text-xs">{listing.seller.name || 'Unknown Seller'}</span>
                </div>
              )}
              
              <Button 
                size="sm" 
                variant="ghost"
                className="text-xs h-7"
                onClick={() => handleViewDetails(listing)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {visibleListings < sortedListings.length && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            className="text-sm"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
