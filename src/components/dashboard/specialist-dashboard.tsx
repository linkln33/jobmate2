"use client";

import { useState, useContext } from 'react';
import { DashboardContext } from '@/components/pages/dashboard-page';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, MapPin, Zap, Trophy, Clock, Calendar, CheckCircle } from 'lucide-react';
import { InteractiveMap } from './interactive-map';
import { formatCurrency } from '@/lib/utils';

// Mock data
const mockJobs = [
  { id: 1, lat: 40.7128, lng: -74.0060, status: 'new' as const, title: 'Plumbing repair', urgency: 'high' as const },
  { id: 2, lat: 40.7228, lng: -74.0160, status: 'accepted' as const, title: 'Electrical work', urgency: 'medium' as const },
  { id: 3, lat: 40.7328, lng: -74.0260, status: 'completed' as const, title: 'Painting service', urgency: 'low' as const },
  { id: 4, lat: 40.7028, lng: -73.9960, status: 'new' as const, title: 'Furniture assembly', urgency: 'high' as const },
  { id: 5, lat: 40.7428, lng: -74.0360, status: 'accepted' as const, title: 'Lawn mowing', urgency: 'medium' as const },
];

const mockJobMatches = [
  { id: 1, title: 'Emergency plumbing repair', price: 150, distance: 0.8, urgency: 'high', customer: 'Sarah Johnson' },
  { id: 2, title: 'Electrical outlet installation', price: 120, distance: 1.2, urgency: 'medium', customer: 'Mike Smith' },
  { id: 3, title: 'Furniture assembly', price: 90, distance: 0.5, urgency: 'low', customer: 'Emily Davis' },
];

const mockEarnings = {
  today: 120,
  week: 750,
  month: 3200,
  pending: 350,
};

const mockWeeklyChallenge = {
  title: 'Complete 3 emergency jobs',
  progress: 1,
  total: 3,
  reward: 50,
};

const mockLeaderboard = [
  { rank: 1, name: 'John Smith', avatar: '/avatars/john.jpg', score: 95, isCurrentUser: false },
  { rank: 2, name: 'Maria Garcia', avatar: '/avatars/maria.jpg', score: 92, isCurrentUser: false },
  { rank: 3, name: 'Current User', avatar: '/avatars/user.jpg', score: 87, isCurrentUser: true },
  { rank: 4, name: 'Robert Lee', avatar: '/avatars/robert.jpg', score: 82, isCurrentUser: false },
  { rank: 5, name: 'Lisa Wong', avatar: '/avatars/lisa.jpg', score: 78, isCurrentUser: false },
];

const mockUpcomingJobs = [
  { id: 1, title: 'Plumbing repair', time: '10:30 AM', date: 'Today', customer: 'Sarah Johnson', address: '123 Main St' },
  { id: 2, title: 'Electrical work', time: '2:00 PM', date: 'Tomorrow', customer: 'Mike Smith', address: '456 Oak Ave' },
  { id: 3, title: 'Furniture assembly', time: '11:00 AM', date: 'Jun 15', customer: 'Emily Davis', address: '789 Pine Rd' },
];

export function SpecialistDashboard() {
  const dashboardContext = useContext(DashboardContext);
  const [isOnDuty, setIsOnDuty] = useState(false);
  
  // Access user data from context
  const user = dashboardContext?.user;
  
  const handleOnDutyToggle = () => {
    setIsOnDuty(!isOnDuty);
  };
  
  return (
    <div className="space-y-6">
      {/* On Duty Toggle and Earnings Summary */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Duty Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="duty-status">On Duty</Label>
                <p className="text-sm text-muted-foreground">
                  {isOnDuty ? 'You are visible to customers' : 'You are invisible to customers'}
                </p>
              </div>
              <Switch
                id="duty-status"
                checked={isOnDuty}
                onCheckedChange={handleOnDutyToggle}
              />
            </div>
            
            {isOnDuty && (
              <div className="rounded-md bg-green-50 p-2 border border-green-200">
                <p className="text-sm text-green-800 flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-green-600" />
                  You've been on duty for 2h 15m
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Today</span>
              <span className="font-medium">{formatCurrency(mockEarnings.today)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="font-medium">{formatCurrency(mockEarnings.week)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="font-medium">{formatCurrency(mockEarnings.month)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Pending Payout</span>
              <span className="font-medium text-primary">{formatCurrency(mockEarnings.pending)}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full">
              <DollarSign className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Interactive Map */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Jobs Near You</h2>
        <div className="h-[300px] sm:h-[400px]">
          <InteractiveMap jobs={mockJobs} />
        </div>
      </div>
      
      {/* Job Matches */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Job Matches</CardTitle>
          <CardDescription>Based on your skills and location</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {mockJobMatches.map(job => (
              <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md border gap-3">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{job.title}</h3>
                    {job.urgency === 'high' && (
                      <Badge className="ml-2 bg-red-500">Urgent</Badge>
                    )}
                  </div>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="mr-3">{job.distance} miles</span>
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>{formatCurrency(job.price)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Customer: {job.customer}
                  </div>
                </div>
                <Button size="sm">Apply</Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Jobs</Button>
        </CardFooter>
      </Card>
      
      {/* Gamification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                <span>{mockWeeklyChallenge.title}</span>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                +{formatCurrency(mockWeeklyChallenge.reward)}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{mockWeeklyChallenge.progress}/{mockWeeklyChallenge.total}</span>
              </div>
              <Progress value={(mockWeeklyChallenge.progress / mockWeeklyChallenge.total) * 100} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Leaderboard</CardTitle>
            <CardDescription>Top performers in your area</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {mockLeaderboard.map(user => (
                <div 
                  key={user.rank}
                  className={`flex items-center p-2 rounded-md ${user.isCurrentUser ? 'bg-primary/10' : ''}`}
                >
                  <div className="w-6 text-center font-medium">{user.rank}</div>
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex-1">
                    <div className={`text-sm ${user.isCurrentUser ? 'font-medium' : ''}`}>
                      {user.name} {user.isCurrentUser && '(You)'}
                    </div>
                  </div>
                  <div className="font-medium">{user.score}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Jobs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Upcoming Jobs</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y">
            {mockUpcomingJobs.map(job => (
              <div key={job.id} className="py-3">
                <div className="flex justify-between">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm">
                    <span className="font-medium">{job.time}</span>
                    <span className="text-muted-foreground ml-1">{job.date}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {job.customer} • {job.address}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <MapPin className="h-3 w-3 mr-1" />
                    Navigate
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    <Clock className="h-3 w-3 mr-1" />
                    Reschedule
                  </Button>
                  <Button size="sm" variant="default" className="h-8 ml-auto">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Start Job
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
