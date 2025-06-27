"use client";

import { MarketplaceListing } from "@/types/marketplace";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Tag, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { ListingLocation } from "@/components/marketplace/listing-detail/listing-location";

interface ListingPreviewStepProps {
  data: Partial<MarketplaceListing>;
}

export function ListingPreviewStep({ data }: ListingPreviewStepProps) {
  // Format price with currency
  const formatPrice = (price?: number) => {
    if (price === undefined) return "$0";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };
  
  // Get type badge color
  const getTypeBadgeColor = () => {
    switch(data.type?.toLowerCase()) {
      case 'job': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'service': 
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'item': 
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rental':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Format pricing type
  const formatPricingType = () => {
    switch(data.pricingType) {
      case 'fixed': return 'Fixed Price';
      case 'auction': return 'Auction';
      case 'hourly': return `Hourly (${data.priceUnit || 'hour'})`;
      case 'daily': return `Daily (${data.priceUnit || 'day'})`;
      case 'negotiable': return 'Negotiable';
      default: return 'Fixed Price';
    }
  };
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Preview Your Listing</h2>
        <p className="text-muted-foreground mb-2">
          Review your listing details before submitting
        </p>
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">
            This is a preview. Your listing will be reviewed before being published.
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Main image */}
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
          {data.imageUrl ? (
            <img 
              src={data.imageUrl} 
              alt={data.title || "Listing preview"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">No image provided</p>
            </div>
          )}
        </div>
        
        {/* Title and badges */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className={getTypeBadgeColor()}>
              {data.type || "Item"}
            </Badge>
            <Badge variant="outline">
              {data.category || "Uncategorized"}
            </Badge>
            {data.condition && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {data.condition}
              </Badge>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-2">
            {data.title || "Untitled Listing"}
          </h1>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Posted on {currentDate}</span>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold">
              {formatPrice(data.price)}
            </span>
            {data.pricingType !== "fixed" && (
              <span className="text-sm text-muted-foreground">
                ({formatPricingType()})
              </span>
            )}
            {data.originalPrice && data.originalPrice > (data.price || 0) && (
              <>
                <span className="text-lg text-muted-foreground line-through ml-2">
                  {formatPrice(data.originalPrice)}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {Math.round(((data.originalPrice - (data.price || 0)) / data.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {data.description ? (
              <p className="whitespace-pre-line">{data.description}</p>
            ) : (
              <p className="text-muted-foreground italic">No description provided</p>
            )}
          </div>
        </div>
        
        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Location */}
        {data.address && data.lat && data.lng && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <div className="flex items-start gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <span>{data.address}</span>
            </div>
            
            <div className="h-[300px] rounded-lg overflow-hidden border">
              <ListingLocation 
                address={data.address}
                lat={data.lat}
                lng={data.lng}
                title={data.title}
                type={data.type}
                price={data.price}
                priceUnit={data.priceUnit}
              />
            </div>
          </div>
        )}
        
        {/* Status */}
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <h3 className="font-medium">Listing Status: Pending Review</h3>
              <p className="text-sm text-muted-foreground">
                Your listing will be reviewed by our team before being published to the marketplace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
