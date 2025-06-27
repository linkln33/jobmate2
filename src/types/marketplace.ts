export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit?: string;
  imageUrl: string;
  tags: string[];
  type: 'job' | 'service' | 'item' | 'rental';
  category: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  isVip?: boolean;
  pricingType?: 'fixed' | 'auction' | 'hourly' | 'daily' | 'negotiable';
  originalPrice?: number;
  auctionEndTime?: string;
  minimumBid?: number;
  currentHighestBid?: number;
  bidCount?: number;
  
  // Location data for map integration
  address?: string;
  lat?: number;
  lng?: number;
  
  // Seller information
  sellerId?: string;
  sellerName?: string;
  sellerImage?: string;
  sellerRating?: number;
  sellerResponseTime?: string;
  contactPhone?: string;
  
  // Additional metadata
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  status?: 'active' | 'pending' | 'sold' | 'expired';
  viewCount?: number;
  favoriteCount?: number;
  
  // User information (required for MarketplaceListingCardProps compatibility)
  user: {
    name: string;
    avatar: string;
  };
}

// Match the type in marketplace-tabs.tsx
export type MarketplaceTabType = 'all' | 'items' | 'services' | 'rentals' | 'jobs';
