"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarketplaceListing as ServiceListing } from "@/services/marketplaceService";
import { MarketplaceListing } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin } from "lucide-react";
import { ListingGallery } from "./listing-gallery";
import { ListingHeader } from "./listing-header";
import { ListingDescription } from "./listing-description";
import { ListingPricing } from "./listing-pricing";
import { ListingLocation } from "./listing-location";
import { ListingSellerInfo } from "./listing-seller-info";
import { ListingActions } from "./listing-actions";
import { ListingReviews } from "./listing-reviews";
import { ListingSimilar } from "./listing-similar";
import { ListingCompatibilitySidebar } from "@/components/compatibility/listing-compatibility-sidebar";
import { Separator } from "@/components/ui/separator";

// Combined interface that works with both UI components and marketplace service data
interface MarketplaceListingDetailProps {
  listing: {
    id: string;
    title: string;
    description: string;
    type: string;
    price?: string | number;
    priceUnit?: string;
    imageUrl?: string;
    tags?: string[];
    isVerified?: boolean;
    isVip?: boolean;
    isFeatured?: boolean;
    address?: string;
    lat?: number;
    lng?: number;
    // Service listing properties
    media?: Array<{
      id: string;
      url: string;
      type: string;
      isPrimary?: boolean;
    }>;
    pricing?: {
      price: number;
      currency: string;
      unit: string;
      negotiable: boolean;
    };
    contactInfo?: {
      phone?: string;
      email?: string;
      website?: string;
    };
    userId?: string;
    location?: {
      city: string;
      state: string;
      address?: string;
      latitude?: number;
      longitude?: number;
    };
    // Seller info (for UI components)
    seller?: {
      id?: string;
      name?: string;
      avatar?: string;
      rating?: number;
      joinDate?: string;
    };
  };
}

export function MarketplaceListingDetail({ listing }: MarketplaceListingDetailProps) {
  // Handle different image formats (direct imageUrl or media array)
  const mainImage = listing.media && listing.media.length > 0 
    ? listing.media.find(m => m.isPrimary)?.url || listing.media[0].url
    : listing.imageUrl || '/placeholder-image.jpg';
  
  const [selectedImage, setSelectedImage] = useState(mainImage);
  
  // Get price as number for calculations
  const priceAsNumber = typeof listing.price === 'string' 
    ? parseFloat(listing.price) 
    : (listing.price || (listing.pricing?.price || 0));
  
  // Get address from either direct property or location object
  const address = listing.address || 
    (listing.location ? `${listing.location.address || ''} ${listing.location.city}, ${listing.location.state}`.trim() : 'No address provided');
  
  // Create default seller info
  const sellerInfo = {
    name: listing.seller?.name || (listing.contactInfo?.email || 'Listing Owner'),
    avatar: listing.seller?.avatar || '/images/avatars/avatar-1.png',
    rating: listing.seller?.rating || 4.5,
    memberSince: listing.seller?.joinDate || 'Jan 2023',
    responseTime: '< 2 hours'
  };
  
  return (
    <div className="container mx-auto py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => window.history.back()}>
          <ChevronLeft size={18} />
          Back to Listings
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Gallery and Seller Info */}
        <div className="lg:col-span-2 space-y-8">
          <ListingGallery 
            mainImage={selectedImage} 
            images={listing.media ? listing.media.map(m => m.url) : (listing.imageUrl ? [listing.imageUrl] : [])} 
            onImageSelect={setSelectedImage} 
          />
          
          <ListingHeader 
            title={listing.title} 
            type={listing.type} 
            isVerified={listing.isVerified || false} 
            isVip={listing.isVip || false} 
            isFeatured={listing.isFeatured || false} 
          />
          
          <ListingDescription 
            description={listing.description} 
            tags={listing.tags || []} 
          />
          
          <ListingLocation 
            address={address}
            lat={listing.lat || (listing.location?.latitude || 0)}
            lng={listing.lng || (listing.location?.longitude || 0)}
            title={listing.title}
            type={listing.type}
            price={priceAsNumber}
            priceUnit={listing.priceUnit || (listing.pricing?.unit || 'fixed')}
          />
          
          <ListingReviews 
            rating={4.8} 
            reviewCount={24} 
          />
        </div>
        
        {/* Right column - Compatibility, Pricing, Actions, and Seller */}
        <div className="space-y-8">
          {/* Compatibility Breakdown */}
          <ListingCompatibilitySidebar
            listingId={listing.id}
            category="marketplace"
            listingData={listing}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
          />
          
          <Separator className="my-4" />
          
          <ListingPricing 
            price={priceAsNumber} 
            pricingType="fixed" 
            originalPrice={priceAsNumber > 0 ? priceAsNumber * 1.2 : undefined} 
          />
          
          <ListingActions 
            listingId={listing.id} 
            contactPhone={listing.contactInfo?.phone || ''}
          />
          
          <ListingSellerInfo 
            sellerName={sellerInfo.name}
            sellerImage={sellerInfo.avatar}
            sellerRating={sellerInfo.rating}
            memberSince={sellerInfo.memberSince}
            responseTime={sellerInfo.responseTime}
          />
        </div>
      </div>
      
      <div className="mt-12">
        <ListingSimilar 
          currentListingId={listing.id}
          currentListingType={listing.type}
        />
      </div>
    </div>
  );
}
