'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, DollarSign, Info } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import priceCalculator, { 
  jobCategories, 
  complexityLevels, 
  experienceLevels, 
  locationFactors, 
  durationImpacts 
} from '@/services/assistant/priceCalculator';

export default function PriceCalculatorPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  // Form state
  const [jobCategory, setJobCategory] = useState(initialCategory ? 
    jobCategories.find(cat => cat.name.toLowerCase().includes(initialCategory.toLowerCase()))?.name || 
    jobCategories[0].name : 
    jobCategories[0].name
  );
  const [complexity, setComplexity] = useState(complexityLevels[1].name); // Default to Standard
  const [experience, setExperience] = useState(experienceLevels[1].name); // Default to Intermediate
  const [location, setLocation] = useState(locationFactors[0].region); // Default to North America
  const [duration, setDuration] = useState(durationImpacts[1].duration); // Default to Medium-term
  const [hours, setHours] = useState(40); // Default to 40 hours
  
  // Result state
  const [estimate, setEstimate] = useState<{
    hourlyMin: number;
    hourlyMax: number;
    totalMin: number;
    totalMax: number;
    explanation: string;
  } | null>(null);
  
  // Calculate estimate when form values change
  useEffect(() => {
    const result = priceCalculator.calculatePriceEstimate(
      jobCategory,
      complexity,
      experience,
      location,
      duration,
      hours
    );
    setEstimate(result);
  }, [jobCategory, complexity, experience, location, duration, hours]);
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/project/setup" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-1" />
          Back to Project Setup
        </Link>
      </div>
      
      <motion.div 
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            <Calculator className="mr-3" />
            Project Price Calculator
          </h1>
          <p className="text-blue-100 mt-2">
            Estimate project costs based on type, complexity, and other factors
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            
            <div className="space-y-4">
              {/* Job Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {jobCategories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {jobCategories.find(c => c.name === jobCategory)?.description}
                </p>
              </div>
              
              {/* Complexity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Complexity
                </label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {complexityLevels.map((level) => (
                    <option key={level.name} value={level.name}>
                      {level.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {complexityLevels.find(c => c.name === complexity)?.description}
                </p>
              </div>
              
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {experienceLevels.map((level) => (
                    <option key={level.name} value={level.name}>
                      {level.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {experienceLevels.find(e => e.name === experience)?.description}
                </p>
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Region
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {locationFactors.map((loc) => (
                    <option key={loc.region} value={loc.region}>
                      {loc.region}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {locationFactors.find(l => l.region === location)?.description}
                </p>
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {durationImpacts.map((dur) => (
                    <option key={dur.duration} value={dur.duration}>
                      {dur.duration}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {durationImpacts.find(d => d.duration === duration)?.description}
                </p>
              </div>
              
              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Hours Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Approximate number of hours needed to complete the project
                </p>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Price Estimate</h2>
            
            {estimate && (
              <motion.div 
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`${jobCategory}-${complexity}-${experience}-${location}-${duration}-${hours}`}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Hourly Rate Range</h3>
                  <div className="flex items-center mt-1">
                    <DollarSign className="text-emerald-500 mr-1" size={20} />
                    <span className="text-2xl font-bold text-emerald-600">
                      ${estimate.hourlyMin} - ${estimate.hourlyMax}
                    </span>
                    <span className="text-gray-500 ml-1">per hour</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Total Project Cost</h3>
                  <div className="flex items-center mt-1">
                    <DollarSign className="text-emerald-500 mr-1" size={24} />
                    <span className="text-3xl font-bold text-emerald-600">
                      ${estimate.totalMin} - ${estimate.totalMax}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on {hours} hours of work
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-start">
                    <Info size={18} className="text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">How we calculated this</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {estimate.explanation}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link 
                    href="/project/setup?price=true" 
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Use This Estimate in My Project
                  </Link>
                </div>
              </motion.div>
            )}
            
            <div className="mt-6 text-sm text-gray-500">
              <p className="flex items-start">
                <Info size={14} className="mr-1 mt-0.5" />
                This calculator provides estimates based on industry averages and may vary based on specific project requirements.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
