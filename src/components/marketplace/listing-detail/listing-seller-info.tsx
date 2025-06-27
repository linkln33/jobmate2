"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, MessageSquare, Shield } from "lucide-react";

interface ListingSellerInfoProps {
  sellerName: string;
  sellerImage: string;
  sellerRating: number;
  memberSince: string;
  responseTime: string;
}

export function ListingSellerInfo({
  sellerName,
  sellerImage,
  sellerRating,
  memberSince,
  responseTime
}: ListingSellerInfoProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">About the Seller</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden">
          <Image
            src={sellerImage}
            alt={sellerName}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        
        <div>
          <h3 className="font-medium">{sellerName}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{sellerRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span>Member since {memberSince}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span>{responseTime}</span>
        </div>
      </div>
      
      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Contact Seller
      </Button>
    </Card>
  );
}
