"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function AuthTestPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [localStorageData, setLocalStorageData] = useState<{token?: string, user?: any}>({});

  useEffect(() => {
    // Check localStorage directly
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      let storedUser = null;
      
      try {
        storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
      
      setLocalStorageData({
        token: storedToken || undefined,
        user: storedUser
      });
    }
  }, []);

  const handleForceRedirect = () => {
    router.push('/dashboard');
  };

  const handleClearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleSetMockData = () => {
    const mockUser = {
      id: 'test-123456',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
      profileImageUrl: 'https://via.placeholder.com/150',
    };
    const mockToken = 'test-mock-token-' + Math.random().toString(36).substring(2);
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    window.location.reload();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
            <CardDescription>
              This page helps debug authentication issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Auth Context State:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto">
                {JSON.stringify({
                  isAuthenticated,
                  isLoading,
                  user,
                  hasToken: !!token
                }, null, 2)}
              </pre>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">LocalStorage Data:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleForceRedirect}>
                Force Navigate to Dashboard
              </Button>
              <Button onClick={handleClearStorage} variant="destructive">
                Clear Auth Storage
              </Button>
              <Button onClick={handleSetMockData} variant="secondary">
                Set Mock Auth Data
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signup">Go to Signup</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
