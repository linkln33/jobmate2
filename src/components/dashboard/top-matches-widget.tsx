import React from "react";
import Link from "next/link";
import Image from "next/image";
import { EnhancedCompatibilityBadge } from "@/components/ui/enhanced-compatibility-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type MatchListing = {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  compatibilityScore: number;
  compatibilityReason?: string;
};

type Props = {
  matches: MatchListing[];
  className?: string;
};

export const TopMatchesWidget = ({ matches, className = "" }: Props) => {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <span className="mr-2">🔍</span> Top Matches for You
      </h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No matches found. Update your preferences to see personalized recommendations.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {matches.map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-md transition"
            >
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src={listing.imageUrl || "/placeholder-image.jpg"}
                  alt={listing.title}
                  fill
                  className="rounded object-cover border"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {listing.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {listing.category} • {listing.location}
                </p>
                {listing.compatibilityReason && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 line-clamp-1">
                    {listing.compatibilityReason}
                  </p>
                )}
              </div>
              
              <div className="w-16 flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <EnhancedCompatibilityBadge 
                          score={listing.compatibilityScore} 
                          size="md" 
                          primaryReason={listing.compatibilityReason}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="font-medium">Compatibility: {Math.round(listing.compatibilityScore * 100)}%</p>
                      {listing.compatibilityReason && (
                        <p className="text-sm">{listing.compatibilityReason}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-right">
        <Link 
          href="/marketplace?sort=compatibility" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all matches →
        </Link>
      </div>
    </div>
  );
};
