"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Star } from "lucide-react";

interface ListingHeaderProps {
  title: string;
  type: string;
  isVerified?: boolean;
  isVip?: boolean;
  isFeatured?: boolean;
}

export function ListingHeader({ 
  title, 
  type, 
  isVerified = false, 
  isVip = false, 
  isFeatured = false 
}: ListingHeaderProps) {
  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'job':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'service':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'item':
        return 'bg-green-500 hover:bg-green-600';
      case 'rental':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={`${getTypeBadgeColor(type)} text-white`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        
        {isVerified && (
          <Badge variant="outline" className="border-blue-500 text-blue-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )}
        
        {isVip && (
          <Badge variant="outline" className="border-purple-500 text-purple-500 flex items-center gap-1">
            <Star className="h-3 w-3" />
            VIP
          </Badge>
        )}
        
        {isFeatured && (
          <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center gap-1">
            <Award className="h-3 w-3" />
            Featured
          </Badge>
        )}
      </div>
      
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}
