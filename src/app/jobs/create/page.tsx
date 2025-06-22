"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateJobPage } from '@/components/pages/create-job-page';
import { Spinner } from '@/components/ui/spinner';

export default function CreateJob() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check authentication directly from localStorage
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get authentication data directly from localStorage
        const storedToken = localStorage.getItem('token');
        const storedUserJson = localStorage.getItem('user');
        
        console.log('Create Job page - Direct localStorage check:', { 
          hasToken: !!storedToken, 
          hasUserData: !!storedUserJson 
        });
        
        // Ensure the auth cookie is set if we have a token in localStorage
        if (storedToken) {
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
          
          if (!authCookie) {
            console.log('Setting missing auth cookie from localStorage token');
            document.cookie = `auth_token=${storedToken}; path=/; max-age=${60*60*24*7}; SameSite=Strict`;
          }
        }
        
        if (storedToken && storedUserJson) {
          try {
            const userData = JSON.parse(storedUserJson);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (e) {
            console.error('Error parsing user data:', e);
            redirectToLogin();
          }
        } else {
          console.log('No auth data in localStorage, redirecting to login');
          redirectToLogin();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        redirectToLogin();
      } finally {
        setIsLoading(false);
      }
    };
    
    const redirectToLogin = () => {
      // Use Next.js router for client-side navigation
      router.push('/login');
    };
    
    // Run immediately to avoid flashing content
    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12 text-brand-500" />
      </div>
    );
  }

  // Show create job page if authenticated
  if (isAuthenticated && user) {
    return <CreateJobPage />;
  }
  
  // This should never be reached as we redirect in the useEffect
  return null;
}
