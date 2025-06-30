/**
 * @file SpecialistsHits component for displaying Algolia search results for specialists
 * @module components/search/specialists-hits
 */

import React from 'react';
import { useHits } from 'react-instantsearch';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

/**
 * Helper function to extract initials from a full name
 * Used for avatar fallbacks when profile images are not available
 *
 * @param {string} name - The full name to extract initials from
 * @returns {string} - The extracted initials in uppercase
 */
const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

/**
 * SpecialistsHits component that renders search results for specialists from Algolia
 * Features:
 * - Displays specialists in a responsive grid layout
 * - Shows loading state with skeleton UI during data fetch
 * - Displays empty state when no results are found
 * - Renders specialist cards with profile image, name, rating, skills, etc.
 * - Links to specialist profile pages
 *
 * @returns {JSX.Element} A grid of specialist cards or appropriate loading/empty states
 */
export function SpecialistsHits() {
  const { hits, results } = useHits();

  // Loading state
  if (!results) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-lg animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-grow">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (hits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Briefcase className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No specialists found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We couldn't find any specialists matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hits.map((hit) => (
        <Card key={hit.objectID} className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={hit.imageUrl} alt={hit.title} />
                <AvatarFallback className="bg-gradient-to-r from-brand-500 to-blue-500 text-white">
                  {getInitials(hit.title)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{hit.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{hit.subcategory}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{hit.rating}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">({hit.reviews})</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hit.location?.city}, {hit.location?.country}</span>
                  <span className="mx-2">•</span>
                  <span>${hit.price}/hr</span>
                </div>
                
                <p className="mt-3 text-sm line-clamp-2">{hit.description}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {hit.tags && hit.tags.slice(0, 3).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                      {skill}
                    </Badge>
                  ))}
                  {hit.tags && hit.tags.length > 3 && (
                    <Badge variant="outline">+{hit.tags.length - 3}</Badge>
                  )}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{hit.completedJobs} jobs completed</span>
                  </div>
                  <Button asChild size="sm" className="bg-gradient-to-r from-brand-500 to-blue-500 hover:from-brand-600 hover:to-blue-600">
                    <Link href={`/specialists/${hit.objectID}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default SpecialistsHits;
