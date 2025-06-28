"use client";

import React, { useState } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactECharts from 'echarts-for-react';
import { MonthlyEarningsChart } from '@/components/charts/monthly-earnings-chart';
import { JobTypeChart } from '@/components/charts/job-type-chart';
import { WeeklyJobsChart } from '@/components/charts/weekly-jobs-chart';
import { PerformanceMetricsChart } from '@/components/charts/performance-metrics-chart';
import { RevenueForecastChart } from '@/components/charts/revenue-forecast-chart';

// Mock data for charts
const monthlyEarningsData = [
  { month: 'Jan', earnings: 2400 },
  { month: 'Feb', earnings: 1800 },
  { month: 'Mar', earnings: 3200 },
  { month: 'Apr', earnings: 3800 },
  { month: 'May', earnings: 4200 },
  { month: 'Jun', earnings: 4800 },
];

const jobTypeData = [
  { type: 'Plumbing', value: 35 },
  { type: 'Electrical', value: 25 },
  { type: 'Carpentry', value: 20 },
  { type: 'Painting', value: 15 },
  { type: 'Other', value: 5 },
];

const weekdayData = [
  { day: 'Mon', jobs: 12 },
  { day: 'Tue', jobs: 8 },
  { day: 'Wed', jobs: 15 },
  { day: 'Thu', jobs: 10 },
  { day: 'Fri', jobs: 18 },
  { day: 'Sat', jobs: 22 },
  { day: 'Sun', jobs: 6 },
];

const performanceMetricsData = [
  { month: 'Jan', responseTime: 2.5, completionRate: 92, clientSatisfaction: 4.5 },
  { month: 'Feb', responseTime: 2.3, completionRate: 93, clientSatisfaction: 4.6 },
  { month: 'Mar', responseTime: 2.1, completionRate: 95, clientSatisfaction: 4.7 },
  { month: 'Apr', responseTime: 1.9, completionRate: 96, clientSatisfaction: 4.8 },
  { month: 'May', responseTime: 1.8, completionRate: 97, clientSatisfaction: 4.8 },
  { month: 'Jun', responseTime: 1.7, completionRate: 98, clientSatisfaction: 4.9 },
];

const revenueForecastData = [
  { month: 'Jan', revenue: 5000, expenses: 2000, profit: 3000 },
  { month: 'Feb', revenue: 5500, expenses: 2200, profit: 3300 },
  { month: 'Mar', revenue: 6000, expenses: 2300, profit: 3700 },
  { month: 'Apr', revenue: 6200, expenses: 2400, profit: 3800 },
  { month: 'May', revenue: 6800, expenses: 2500, profit: 4300 },
  { month: 'Jun', revenue: 7500, expenses: 2600, profit: 4900 },
];

const clientAcquisitionData = [
  { month: 'Jan', newClients: 8, returningClients: 12 },
  { month: 'Feb', newClients: 10, returningClients: 15 },
  { month: 'Mar', newClients: 12, returningClients: 18 },
  { month: 'Apr', newClients: 15, returningClients: 22 },
  { month: 'May', newClients: 18, returningClients: 25 },
  { month: 'Jun', newClients: 22, returningClients: 28 },
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
              <MonthlyEarningsChart data={monthlyEarningsData} projectionMonths={3} />
              <Card>
                <CardHeader>
                  <CardTitle>Completed Jobs by Type</CardTitle>
                  <p className="text-sm text-muted-foreground">Distribution of jobs you've completed throughout your JobMate journey</p>
                </CardHeader>
                <CardContent>
                  <JobTypeChart data={jobTypeData} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <WeeklyJobsChart data={weekdayData} showProjection={true} />
              <PerformanceMetricsChart data={performanceMetricsData} title="Performance Trends" />
            </div>
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <RevenueForecastChart data={revenueForecastData} forecastPeriods={3} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MonthlyEarningsChart 
                data={monthlyEarningsData} 
                projectionMonths={6} 
                title="Extended Earnings Forecast" 
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Direct Jobs</span>
                      <span className="text-sm font-bold">$4,250</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Marketplace Fees</span>
                      <span className="text-sm font-bold">$850</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Referral Bonuses</span>
                      <span className="text-sm font-bold">$520</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Tips</span>
                      <span className="text-sm font-bold">$300</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <WeeklyJobsChart 
                data={weekdayData} 
                showProjection={true} 
                title="Weekly Job Distribution with Projections" 
              />
              <Card>
                <CardHeader>
                  <CardTitle>Completed Jobs by Type</CardTitle>
                  <p className="text-sm text-muted-foreground">Distribution of jobs you've completed throughout your JobMate journey</p>
                </CardHeader>
                <CardContent>
                  <JobTypeChart data={jobTypeData} />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Job Completion Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Job timeline visualization */}
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    
                    <div className="relative pl-6 pb-6">
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"></div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Plumbing Repair</span>
                          <span className="text-xs text-gray-500">Today</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed in 2.5 hours</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">Completed</span>
                          <span className="text-xs ml-2">$120</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pl-6 pb-6">
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-gray-800"></div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Electrical Installation</span>
                          <span className="text-xs text-gray-500">Tomorrow</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Scheduled for 3 hours</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">Scheduled</span>
                          <span className="text-xs ml-2">$180</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800"></div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Furniture Assembly</span>
                          <span className="text-xs text-gray-500">Jun 30, 2025</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Estimated 4 hours</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">Pending</span>
                          <span className="text-xs ml-2">$200</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PerformanceMetricsChart 
                data={performanceMetricsData} 
                title="Client Satisfaction Metrics" 
                projectionMonths={3} 
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Client Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ReactECharts
                      option={{
                        tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                            type: 'shadow'
                          }
                        },
                        legend: {
                          data: ['New Clients', 'Returning Clients'],
                          bottom: 0
                        },
                        grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '15%',
                          top: '3%',
                          containLabel: true
                        },
                        xAxis: {
                          type: 'category',
                          data: clientAcquisitionData.map(item => item.month)
                        },
                        yAxis: {
                          type: 'value'
                        },
                        series: [
                          {
                            name: 'New Clients',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                              focus: 'series'
                            },
                            data: clientAcquisitionData.map(item => item.newClients),
                            itemStyle: {
                              color: '#8b5cf6'
                            }
                          },
                          {
                            name: 'Returning Clients',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                              focus: 'series'
                            },
                            data: clientAcquisitionData.map(item => item.returningClients),
                            itemStyle: {
                              color: '#3b82f6'
                            }
                          }
                        ]
                      }}
                      style={{ height: '100%', width: '100%' }}
                      opts={{ renderer: 'canvas' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Client Retention Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-2">Retention Rate</h3>
                    <div className="flex items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            strokeDasharray="100, 100"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeDasharray="85, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">85%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly retention</p>
                        <p className="text-xs text-green-500">+5% from last quarter</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-2">Avg. Jobs per Client</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">3.7</div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jobs per client</p>
                        <p className="text-xs text-green-500">+0.5 from last quarter</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-2">Client Lifetime Value</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">$850</div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Average CLV</p>
                        <p className="text-xs text-green-500">+$120 from last quarter</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedDashboardLayout>
  );
}
