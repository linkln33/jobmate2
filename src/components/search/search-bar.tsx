"use client";

import React, { useState, useEffect } from 'react';
import { useSearchBox } from 'react-instantsearch';
import { Search as SearchIcon } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  placeholder = "Search for jobs, services, items, rentals...",
  className = ""
}: SearchBarProps) {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);
  
  // Update local state when the query changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);
  
  // Debounce the search to avoid too many requests
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (inputValue !== query) {
        refine(inputValue);
      }
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [inputValue, refine, query]);
  
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
        />
        {inputValue && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => {
              setInputValue('');
              refine('');
            }}
          >
            <span className="sr-only">Clear search</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
