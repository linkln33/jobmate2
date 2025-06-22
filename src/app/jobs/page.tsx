"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedJobsPage } from '@/components/pages/unified-jobs-page';
import { Spinner } from '@/components/ui/spinner';

export default function Jobs() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12 text-brand-500" />
      </div>
    );
  }

  // Show jobs page if authenticated
  if (isAuthenticated && user) {
    return <UnifiedJobsPage />;
  }
  
  // This should never be reached as we redirect in the useEffect
  return null;
}
