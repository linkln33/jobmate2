"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface MarketplaceListingDetailProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingDetail({ listing }: MarketplaceListingDetailProps) {
  const [selectedImage, setSelectedImage] = useState(listing.imageUrl);
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.history.back()}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/marketplace/map'}
            className="flex items-center gap-1"
          >
            <MapPin className="h-4 w-4" />
            View All on Map
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Gallery and Seller Info */}
        <div className="lg:col-span-2 space-y-8">
          <ListingGallery 
            mainImage={selectedImage} 
            images={[listing.imageUrl]} 
            onImageSelect={setSelectedImage} 
          />
          
          <ListingHeader 
            title={listing.title} 
            type={listing.type} 
            isVerified={listing.isVerified} 
            isVip={listing.isVip} 
            isFeatured={listing.isFeatured} 
          />
          
          <ListingDescription 
            description={listing.description} 
            tags={listing.tags} 
          />
          
          <ListingLocation 
            address={listing.address || 'No address provided'}
            lat={listing.lat}
            lng={listing.lng}
            title={listing.title}
            type={listing.type}
            price={listing.price}
            priceUnit={listing.priceUnit}
          />
          
          <ListingReviews 
            rating={4.8} 
            reviewCount={24} 
          />
        </div>
        
        {/* Right column - Pricing, Actions, and Seller */}
        <div className="space-y-8">
          <ListingPricing 
            price={listing.price} 
            pricingType="fixed" // Could be "fixed", "auction", "hourly", etc.
            originalPrice={listing.price * 1.2} // Example for discounted items
          />
          
          <ListingActions 
            listingId={listing.id} 
            contactPhone="+1 (555) 123-4567" // This would come from the listing in a real app
          />
          
          <ListingSellerInfo 
            sellerName={listing.seller?.name || 'Unknown Seller'}
            sellerImage={listing.seller?.avatar || '/images/avatars/avatar-1.png'}
            sellerRating={listing.seller?.rating || 4.5}
            memberSince={listing.seller?.memberSince || 'Unknown'}
            responseTime={listing.seller?.responseTime || 'Usually responds within 24 hours'}
          />
        </div>
      </div>
      
      <div className="mt-16">
        <ListingSimilar 
          currentListingId={listing.id}
          currentListingType={listing.type}
        />
      </div>
    </div>
  );
}
