'use client';

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AssistantAnalyticsDashboard from '@/components/assistant/AssistantAnalyticsDashboard';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';

export default function AssistantAnalyticsPage() {
  const { user, isLoading } = useAuth();
  
  // Redirect if not authenticated
  if (!isLoading && !user) {
    redirect('/login');
  }
  
  return (
    <UnifiedDashboardLayout title="Assistant Analytics" showMap={false}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Assistant Analytics</h1>
          <p className="text-gray-600 mt-2">
            View insights and usage statistics for your AI assistant
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AssistantAnalyticsDashboard />
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
