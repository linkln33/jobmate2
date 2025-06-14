"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
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

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <MainLayout>
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
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,240.00</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">8 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customer Ratings</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5.0</div>
              <p className="text-xs text-muted-foreground">Based on 18 reviews</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full flex flex-col">
                <div className="flex-1 flex">
                  {monthlyEarningsData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end items-center">
                      <div 
                        className="w-12 bg-blue-500 rounded-t-md" 
                        style={{ height: `${(item.amount / 1500) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <span className="text-sm font-medium">Total: $6,920</span>
                  <span className="text-sm text-green-500">+16% vs last period</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Types</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full flex items-center justify-center">
                <div className="relative h-48 w-48">
                  {/* Simulated pie chart */}
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 50% 0, 100% 0, 100% 50%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-red-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">40 Jobs</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
                  <span className="text-sm">{jobTypeData[0].type}: {jobTypeData[0].count}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                  <span className="text-sm">{jobTypeData[1].type}: {jobTypeData[1].count}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
                  <span className="text-sm">{jobTypeData[2].type}: {jobTypeData[2].count}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                  <span className="text-sm">{jobTypeData[3].type}: {jobTypeData[3].count}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Weekly Job Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full flex flex-col">
                <div className="flex-1 flex items-end">
                  {weekdayData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-12 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-md" 
                        style={{ height: `${(item.jobs / 10) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2">{item.day}</span>
                      <span className="text-xs font-bold">{item.jobs}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Busiest Day</div>
                    <div className="text-lg font-bold">Saturday</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Avg. Jobs/Day</div>
                    <div className="text-lg font-bold">6.1</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
