"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateService() {
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
        
        console.log('Create Service page - Direct localStorage check:', { 
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
        console.error('Error checking authentication:', error);
        redirectToLogin();
      } finally {
        setIsLoading(false);
      }
    };

    const redirectToLogin = () => {
      router.push('/login?redirect=/services/create');
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create a New Service</CardTitle>
            <CardDescription>
              List your professional services to attract potential clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Service Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Professional Web Development"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <select 
                  id="category"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Select a category</option>
                  <option value="design">Design & Creative</option>
                  <option value="development">Development & IT</option>
                  <option value="marketing">Marketing</option>
                  <option value="writing">Writing & Translation</option>
                  <option value="admin">Admin & Support</option>
                  <option value="finance">Finance & Accounting</option>
                  <option value="legal">Legal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail..."
                  className="w-full min-h-[150px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium">
                    Price ($)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 50"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration" className="block text-sm font-medium">
                    Duration
                  </label>
                  <select 
                    id="duration"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="week">Per Week</option>
                    <option value="project">Per Project</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium">
                  Service Location
                </label>
                <select 
                  id="location"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="remote">Remote / Online</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid (Remote & On-site)</option>
                </select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button>
              Create Service
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
