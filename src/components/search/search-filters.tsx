"use client";

import React, { useState } from 'react';
import { useRefinementList, useRange } from 'react-instantsearch';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button 
        className="flex justify-between items-center w-full text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}

interface CategoryFilterProps {
  attribute: string;
  title: string;
  limit?: number;
}

function CategoryFilter({ attribute, title, limit = 5 }: CategoryFilterProps) {
  const { items, refine } = useRefinementList({
    attribute,
    limit,
    sortBy: ['count:desc']
  });
  
  return (
    <FilterSection title={title}>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center">
            <input
              type="checkbox"
              id={`${attribute}-${item.label}`}
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label 
              htmlFor={`${attribute}-${item.label}`}
              className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex-1"
            >
              {item.label}
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({item.count})
            </span>
          </div>
        ))}
      </div>
    </FilterSection>
  );
}

interface PriceRangeFilterProps {
  attribute: string;
}

function PriceRangeFilter({ attribute }: PriceRangeFilterProps) {
  const { range, start, refine } = useRange({
    attribute,
  });
  
  const [localRange, setLocalRange] = useState({
    min: start[0] || 0,
    max: start[1] || 1000
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalRange(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refine([localRange.min, localRange.max]);
  };
  
  if (!range.min || !range.max) {
    return null;
  }
  
  return (
    <FilterSection title="Price Range">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              name="min"
              min={range.min}
              max={range.max}
              value={localRange.min}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              name="max"
              min={range.min}
              max={range.max}
              value={localRange.max}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
        >
          Apply
        </button>
      </form>
    </FilterSection>
  );
}

export function SearchFilters() {
  return (
    <div className="space-y-1">
      <CategoryFilter 
        attribute="category"
        title="Categories"
      />
      
      <PriceRangeFilter 
        attribute="price"
      />
      
      <CategoryFilter 
        attribute="tags"
        title="Tags"
        limit={10}
      />
    </div>
  );
}
