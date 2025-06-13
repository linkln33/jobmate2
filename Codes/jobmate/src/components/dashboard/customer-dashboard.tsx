"use client";

import { useState, useContext, useEffect } from 'react';
import { DashboardContext } from '@/components/pages/dashboard-page';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, MessageSquare, Zap, Clock, MapPin, CreditCard } from 'lucide-react';
import { InteractiveMap } from './interactive-map';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

// Mock data
const mockJobs = [
  { id: 1, lat: 40.7128, lng: -74.0060, status: 'new' as const, title: 'Plumbing repair', urgency: 'high' as const },
  { id: 2, lat: 40.7228, lng: -74.0160, status: 'accepted' as const, title: 'Electrical work', urgency: 'medium' as const },
  { id: 3, lat: 40.7328, lng: -74.0260, status: 'completed' as const, title: 'Painting service', urgency: 'low' as const },
  { id: 4, lat: 40.7028, lng: -73.9960, status: 'new' as const, title: 'Furniture assembly', urgency: 'high' as const },
  { id: 5, lat: 40.7428, lng: -74.0360, status: 'accepted' as const, title: 'Lawn mowing', urgency: 'medium' as const },
];

const mockSpecialists = [
  { id: 1, name: 'John Doe', avatar: '/avatars/john.jpg', rating: 4.8, distance: 0.8, status: 'online' },
  { id: 2, name: 'Jane Smith', avatar: '/avatars/jane.jpg', rating: 4.9, distance: 1.2, status: 'online' },
  { id: 3, name: 'Mike Johnson', avatar: '/avatars/mike.jpg', rating: 4.7, distance: 1.5, status: 'online' },
];

const mockSuggestions = [
  { id: 1, text: 'Need help unclogging a drain?', icon: <Zap className="h-5 w-5 text-yellow-500" /> },
  { id: 2, text: 'Rain expected today, want to check your gutters?', icon: <Zap className="h-5 w-5 text-blue-500" /> },
  { id: 3, text: 'Time for your annual HVAC maintenance?', icon: <Clock className="h-5 w-5 text-green-500" /> },
];

const mockRecentActivity = [
  { id: 1, title: 'Plumbing repair', status: 'completed', date: '2025-06-10', specialist: 'John Doe' },
  { id: 2, title: 'Electrical work', status: 'in progress', date: '2025-06-12', specialist: 'Jane Smith' },
  { id: 3, title: 'Lawn mowing', status: 'scheduled', date: '2025-06-15', specialist: 'Mike Johnson' },
];

export function CustomerDashboard() {
  const dashboardContext = useContext(DashboardContext);
  const [activeSpecialists, setActiveSpecialists] = useState(mockSpecialists);
  
  // Access user data from context
  const user = dashboardContext?.user;
  
  return (
    <div className="space-y-6">
      {/* Quick Actions Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Post a New Job
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {mockSuggestions.map(suggestion => (
              <div key={suggestion.id} className="flex items-start p-2 rounded-md hover:bg-muted cursor-pointer">
                {suggestion.icon}
                <span className="ml-2 text-sm">{suggestion.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Interactive Map */}
      <Card>
        <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Job Map</CardTitle>
            <CardDescription>View your active jobs on the map</CardDescription>
          </div>
          <Link href="/map" className="text-sm text-blue-600 hover:underline">View full map</Link>
        </CardHeader>
        <CardContent className="p-0 h-[300px] sm:h-[400px] relative overflow-hidden rounded-b-lg">
          <InteractiveMap jobs={mockJobs} />
        </CardContent>
      </Card>
      
      {/* Active Specialists */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Specialists Nearby</CardTitle>
          <CardDescription>
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              {activeSpecialists.length} Pros Online
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSpecialists.map(specialist => (
              <div key={specialist.id} className="flex items-center p-2 rounded-md border flex-wrap sm:flex-nowrap">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={specialist.avatar} alt={specialist.name} />
                    <AvatarFallback>{specialist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">{specialist.name}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-2">⭐ {specialist.rating}</span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {specialist.distance} miles away
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Contact</Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Specialists</Button>
        </CardFooter>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {mockRecentActivity.map(activity => (
              <div key={activity.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={activity.status === 'completed' ? 'success' : activity.status === 'in progress' ? 'default' : 'outline'}>
                      {activity.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{activity.specialist}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Activity</Button>
        </CardFooter>
      </Card>
      
      {/* Smart Reminders */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Smart Reminders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="p-3 rounded-md bg-blue-50 border border-blue-200 flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Maintenance Reminder</p>
              <p className="text-sm text-blue-600">
                You booked a handyman 6 months ago — time to schedule an inspection again?
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" className="h-8">Schedule Now</Button>
                <Button size="sm" variant="ghost" className="h-8">Remind Later</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 06/2026</p>
                </div>
              </div>
              <Badge>Default</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Accepted payment methods</p>
              <div className="flex space-x-3">
                <div className="h-8 flex items-center">
                  <img src="/images/payment/visa.png" alt="Visa" className="h-5" />
                </div>
                <div className="h-8 flex items-center">
                  <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-5" />
                </div>
                <div className="h-8 flex items-center">
                  <img src="/images/payment/amex.png" alt="American Express" className="h-5" />
                </div>
                <div className="h-8 flex items-center">
                  <img src="/images/payment/paypal.png" alt="PayPal" className="h-5" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
