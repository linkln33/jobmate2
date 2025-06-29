"use client";

import React, { useState } from 'react';
import CompatibilityBadge from './CompatibilityBadge';
import CompatibilityBreakdown from './CompatibilityBreakdown';
import CompatibilityListingCard from './CompatibilityListingCard';
import { MainCategory } from '@/types/compatibility';

// Example job listing data
const exampleJobListing = {
  id: 'job-123',
  title: 'Senior React Developer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  salary: 120000,
  requiredSkills: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
  workArrangement: 'remote',
  experienceLevel: 'senior',
  description: 'We are looking for a senior React developer to join our team...',
  subcategory: 'remote'
};

// Example service listing data
const exampleServiceListing = {
  id: 'service-456',
  title: 'Professional Web Design',
  provider: 'DesignStudio',
  location: 'Los Angeles, CA',
  price: 2500,
  type: 'design',
  providerRating: 4.8,
  distance: 15,
  description: 'Professional web design services for businesses...',
  subcategory: 'design'
};

// Example rental listing data
const exampleRentalListing = {
  id: 'rental-789',
  title: 'Modern Downtown Apartment',
  location: 'San Francisco, CA',
  price: 2800,
  type: 'apartments',
  amenities: ['wifi', 'parking', 'gym', 'laundry'],
  duration: 12,
  description: 'Beautiful modern apartment in downtown...',
  subcategory: 'apartments'
};

export const CompatibilityExample: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('jobs');
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Get the appropriate listing based on selected category
  const getListingData = () => {
    switch (selectedCategory) {
      case 'jobs':
        return exampleJobListing;
      case 'services':
        return exampleServiceListing;
      case 'rentals':
        return exampleRentalListing;
      default:
        return exampleJobListing;
    }
  };
  
  const listingData = getListingData();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Compatibility Score System Demo</h1>
      
      {/* Category selector */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Select Category:</h2>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${selectedCategory === 'jobs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedCategory('jobs')}
          >
            Jobs
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedCategory === 'services' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedCategory('services')}
          >
            Services
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedCategory === 'rentals' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedCategory('rentals')}
          >
            Rentals
          </button>
        </div>
      </div>
      
      {/* Example listing with compatibility badge */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Listing with Compatibility Badge:</h2>
        <CompatibilityListingCard
          listingId={listingData.id}
          category={selectedCategory}
          listingData={listingData}
        >
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-xl font-bold">{listingData.title}</h3>
            <p className="text-gray-600">{listingData.location}</p>
            <p className="mt-2">{selectedCategory === 'jobs' ? `$${listingData.salary}/year` : `$${listingData.price}`}</p>
            <p className="mt-2 text-sm text-gray-500">{listingData.description}</p>
          </div>
        </CompatibilityListingCard>
      </div>
      
      {/* Standalone compatibility badge */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Standalone Compatibility Badge:</h2>
        <div className="flex items-center space-x-4">
          <CompatibilityBadge
            score={85}
            size="lg"
            animated={true}
            showDetails={true}
            dimensions={[
              { name: 'Skills Match', score: 90, weight: 0.4, description: 'Your skills align well with this job' },
              { name: 'Salary Match', score: 85, weight: 0.3, description: 'The salary matches your expectations' },
              { name: 'Location Match', score: 75, weight: 0.2, description: 'Located within reasonable distance' },
              { name: 'Experience Match', score: 80, weight: 0.1, description: 'The experience level is a good match' }
            ]}
            onClick={() => setShowBreakdown(!showBreakdown)}
          />
          <div>
            <p className="font-medium">Click on the badge to see detailed breakdown</p>
            <p className="text-sm text-gray-500">This is a standalone badge that can be used anywhere</p>
          </div>
        </div>
      </div>
      
      {/* Compatibility breakdown */}
      {showBreakdown && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">Compatibility Breakdown:</h2>
          <CompatibilityBreakdown
            result={{
              overallScore: 85,
              dimensions: [
                { name: 'Skills Match', score: 90, weight: 0.4, description: 'Your skills align well with this job' },
                { name: 'Salary Match', score: 85, weight: 0.3, description: 'The salary matches your expectations' },
                { name: 'Location Match', score: 75, weight: 0.2, description: 'Located within reasonable distance' },
                { name: 'Experience Match', score: 80, weight: 0.1, description: 'The experience level is a good match' }
              ],
              category: 'jobs',
              subcategory: 'remote',
              listingId: 'job-123',
              userId: 'user-1',
              timestamp: new Date(),
              primaryMatchReason: 'Strong match on skills and salary',
              improvementSuggestions: [
                'Consider jobs with higher salaries',
                'Look for opportunities closer to your location',
                'Update your skills to improve matches'
              ]
            }}
          />
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Implementation Notes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>The compatibility system is modular with separate scorers for each category</li>
          <li>Scores are calculated based on user preferences and listing attributes</li>
          <li>The API endpoint at <code>/api/compatibility</code> handles server-side calculations</li>
          <li>Use the <code>useCompatibility</code> hook to easily integrate with React components</li>
          <li>Visual components include badges, tooltips, and detailed breakdowns</li>
        </ul>
      </div>
    </div>
  );
};

export default CompatibilityExample;
