"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  comment: string;
}

interface ListingReviewsProps {
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Alex Johnson",
    userImage: "/images/avatars/avatar-2.png",
    rating: 5,
    date: "June 15, 2025",
    comment: "Excellent service! The seller was very professional and delivered exactly what I needed. Would definitely recommend to others looking for quality work."
  },
  {
    id: "2",
    userName: "Sarah Miller",
    userImage: "/images/avatars/avatar-3.png",
    rating: 4,
    date: "June 10, 2025",
    comment: "Good experience overall. Communication was great and the work was completed on time. Just a few minor details that needed adjustment."
  },
  {
    id: "3",
    userName: "Michael Brown",
    userImage: "/images/avatars/avatar-4.png",
    rating: 5,
    date: "June 5, 2025",
    comment: "Fantastic! Exceeded my expectations in every way. The seller went above and beyond to ensure I was satisfied with the final result."
  }
];

export function ListingReviews({ 
  rating, 
  reviewCount,
  reviews = mockReviews
}: ListingReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Calculate rating distribution
  const ratingDistribution = {
    5: Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100) || 0,
    4: Math.round((reviews.filter(r => r.rating === 4).length / reviews.length) * 100) || 0,
    3: Math.round((reviews.filter(r => r.rating === 3).length / reviews.length) * 100) || 0,
    2: Math.round((reviews.filter(r => r.rating === 2).length / reviews.length) * 100) || 0,
    1: Math.round((reviews.filter(r => r.rating === 1).length / reviews.length) * 100) || 0
  };
  
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Reviews ({reviewCount})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold mb-2">{rating.toFixed(1)}</div>
          <div className="flex items-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {reviewCount} reviews
          </div>
        </div>
        
        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <div className="w-6 text-sm font-medium">{star}</div>
              <Star className="h-4 w-4 text-yellow-400" />
              <Progress value={ratingDistribution[star as keyof typeof ratingDistribution]} className="h-2 flex-1" />
              <div className="w-8 text-sm text-right">
                {ratingDistribution[star as keyof typeof ratingDistribution]}%
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Review List */}
      <div className="space-y-6 mt-8">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <img src={review.userImage} alt={review.userName} />
                </Avatar>
                <div>
                  <div className="font-medium">{review.userName}</div>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
      
      {reviews.length > 2 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="flex items-center gap-1"
          >
            {showAllReviews ? "Show Less" : "Show All Reviews"}
            <ChevronDown className={`h-4 w-4 transition-transform ${showAllReviews ? "rotate-180" : ""}`} />
          </Button>
        </div>
      )}
    </Card>
  );
}
