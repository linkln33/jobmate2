"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  isLoading?: boolean;
  className?: string;
  variant?: "default" | "pill";
  autoFocus?: boolean;
  debounceMs?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  onResultSelect,
  results = [],
  isLoading = false,
  className,
  variant = "default",
  autoFocus = false,
  debounceMs = 300,
  value: controlledValue,
  onChange: controlledOnChange,
}: SearchInputProps) {
  const [query, setQuery] = React.useState(controlledValue || "");
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Handle controlled component
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setQuery(controlledValue);
    }
  }, [controlledValue]);

  // Debounce search
  React.useEffect(() => {
    if (!onSearch) return;
    
    const handler = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch, debounceMs]);

  // Handle outside click to close results
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        inputRef.current && 
        !resultsRef.current.contains(event.target as Node) && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (controlledOnChange) {
      controlledOnChange(newValue);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (controlledOnChange) {
      controlledOnChange("");
    }
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
      setIsFocused(false);
    }
  };

  const showResults = isFocused && (results.length > 0 || isLoading);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center",
          variant === "pill" && "rounded-full overflow-hidden"
        )}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          autoFocus={autoFocus}
          className={cn(
            "pl-9 pr-10",
            variant === "pill" && "rounded-full"
          )}
        />
        {query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 rounded-full"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {showResults && (
        <div
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-2 shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ul className="max-h-80 overflow-auto">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleResultClick(result)}
                  >
                    {result.icon && <span>{result.icon}</span>}
                    <div className="overflow-hidden">
                      <p className="truncate font-medium">{result.title}</p>
                      {result.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
