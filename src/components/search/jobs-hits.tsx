/**
 * @file JobsHits component for displaying Algolia search results for jobs
 * @module components/search/jobs-hits
 */

import React from 'react';
import { useHits } from 'react-instantsearch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, Briefcase } from 'lucide-react';
import Link from 'next/link';

/**
 * JobsHits component that renders search results for jobs from Algolia
 * Features:
 * - Displays jobs in a vertical list layout
 * - Shows loading state with skeleton UI during data fetch
 * - Displays empty state when no results are found
 * - Renders job cards with title, description, location, budget, etc.
 * - Links to job detail pages
 * - Shows job type badges and other relevant metadata
 *
 * @returns {JSX.Element} A list of job cards or appropriate loading/empty states
 */
export function JobsHits() {
  const { hits, results } = useHits();

  // Loading state
  if (!results) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-lg animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 mb-4">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
        <h3 className="text-lg font-medium mb-2">No jobs found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {hits.map((hit) => (
        <Card key={hit.objectID} className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{hit.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{hit.company}</p>
              </div>
              <Badge className="bg-gradient-to-r from-brand-500 to-blue-500 text-white">
                {hit.jobType || hit.subcategory}
              </Badge>
            </div>
            
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{hit.location?.city}, {hit.location?.country}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>{hit.duration || 'Full-time'}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted {new Date(hit.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="mt-3 text-sm line-clamp-2">{hit.description}</p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {hit.tags && hit.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-brand-600 dark:text-brand-400 font-medium">
                ${hit.price?.toLocaleString()}
              </div>
              <Button asChild size="sm" className="bg-gradient-to-r from-brand-500 to-blue-500 hover:from-brand-600 hover:to-blue-600">
                <Link href={`/jobs/${hit.objectID}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default JobsHits;
