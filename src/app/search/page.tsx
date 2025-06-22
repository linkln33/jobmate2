"use client";

import { useAuth } from '@/contexts/AuthContext';
import { UnifiedSearchPage } from '@/components/pages/unified-search-page';
import { Spinner } from '@/components/ui/spinner';

export default function Search() {
  const { isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12 text-brand-500" />
      </div>
    );
  }

  // Show search page for both authenticated and unauthenticated users
  return <UnifiedSearchPage />;
}
