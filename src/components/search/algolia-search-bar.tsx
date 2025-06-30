/**
 * @file AlgoliaSearchBar component for integrating search functionality with Algolia
 * @module components/search/algolia-search-bar
 */

import React, { useState, useEffect } from 'react';
import { useSearchBox } from 'react-instantsearch';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

/**
 * Custom hook that delays updating a value until a specified delay has passed
 * Used to prevent excessive API calls during rapid user input
 *
 * @template T - The type of the value being debounced
 * @param {T} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {T} - The debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * AlgoliaSearchBar component that provides a search input integrated with Algolia InstantSearch
 * Features:
 * - Debounced search input to prevent excessive API calls
 * - Clear button to reset search
 * - Styled according to JobMate design system
 * - Automatically syncs with Algolia's query state
 *
 * @returns {JSX.Element} A search input component connected to Algolia search
 */
export function AlgoliaSearchBar() {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);

  // Update local state when the query changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Debounce the search to avoid too many requests
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedValue !== query) {
      refine(debouncedValue);
    }
  }, [debouncedValue, refine, query]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Clear the search input
  const handleClear = () => {
    setInputValue('');
    refine('');
  };

  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder="Search for jobs, skills, or specialists..."
        value={inputValue}
        onChange={handleChange}
        className="pl-10 pr-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none shadow-md"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default AlgoliaSearchBar;
