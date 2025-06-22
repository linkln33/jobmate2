"use client";

import React, { useState } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Activity, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for charts
const monthlyEarningsData = [
  { month: 'Jan', amount: 950 },
  { month: 'Feb', amount: 1100 },
  { month: 'Mar', amount: 980 },
  { month: 'Apr', amount: 1250 },
  { month: 'May', amount: 1400 },
  { month: 'Jun', amount: 1240 },
];

const jobTypeData = [
  { type: 'Plumbing', count: 12 },
  { type: 'Electrical', count: 8 },
  { type: 'Cleaning', count: 15 },
  { type: 'Moving', count: 5 },
];

const weekdayData = [
  { day: 'Mon', jobs: 4 },
  { day: 'Tue', jobs: 6 },
  { day: 'Wed', jobs: 8 },
  { day: 'Thu', jobs: 5 },
  { day: 'Fri', jobs: 7 },
  { day: 'Sat', jobs: 10 },
  { day: 'Sun', jobs: 3 },
];

export function UnifiedInsightsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <UnifiedDashboardLayout title="Insights & Stats - JobMate" showMap={false}>
      <div className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Insights & Stats
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              View your performance metrics and analytics
            </p>
          </div>
          <div className="flex space-x-2">
            <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700">
              Clients
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$5,920</h3>
                    <p className="text-xs text-green-500">+12% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Jobs</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">43</h3>
                    <p className="text-xs text-green-500">+8% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Clients</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">17</h3>
                    <p className="text-xs text-green-500">+24% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Response Time</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2.4h</h3>
                    <p className="text-xs text-red-500">+0.3h from last month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Bar Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Job Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Pie Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Detailed earnings content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Jobs Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Detailed jobs analysis content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Detailed client insights content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedDashboardLayout>
  );
}
