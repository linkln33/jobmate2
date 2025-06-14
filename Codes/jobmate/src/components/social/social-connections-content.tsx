"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Twitter, 
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Share2,
  Globe,
  TrendingUp
} from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  url: string;
  connected: boolean;
  verified: boolean;
  icon: React.ReactNode;
  color: string;
}

export function SocialConnectionsContent() {
  const { toast } = useToast();
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      id: 'facebook',
      platform: 'Facebook',
      username: '',
      url: '',
      connected: false,
      verified: false,
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      username: '',
      url: '',
      connected: false,
      verified: false,
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-pink-500'
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      username: '',
      url: '',
      connected: false,
      verified: false,
      icon: <Linkedin className="h-5 w-5" />,
      color: 'bg-blue-700'
    },
    {
      id: 'youtube',
      platform: 'YouTube',
      username: '',
      url: '',
      connected: false,
      verified: false,
      icon: <Youtube className="h-5 w-5" />,
      color: 'bg-red-600'
    },
    {
      id: 'twitter',
      platform: 'Twitter',
      username: '',
      url: '',
      connected: false,
      verified: false,
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-blue-400'
    }
  ]);

  const [showProfileOnMarketplace, setShowProfileOnMarketplace] = useState(true);
  const [autoShareJobs, setAutoShareJobs] = useState(false);
  const [autoShareReviews, setAutoShareReviews] = useState(false);
  
  const handleConnect = (id: string) => {
    // In a real app, this would open OAuth flow
    const updatedAccounts = socialAccounts.map(account => {
      if (account.id === id) {
        return {
          ...account,
          connected: true,
          verified: true,
          username: `user_${Math.floor(Math.random() * 10000)}`,
          url: `https://${account.id}.com/user_${Math.floor(Math.random() * 10000)}`
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    
    toast({
      title: "Account Connected",
      description: `Your ${id.charAt(0).toUpperCase() + id.slice(1)} account has been successfully connected.`,
    });
  };
  
  const handleDisconnect = (id: string) => {
    const updatedAccounts = socialAccounts.map(account => {
      if (account.id === id) {
        return {
          ...account,
          connected: false,
          verified: false,
          username: '',
          url: ''
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    
    toast({
      title: "Account Disconnected",
      description: `Your ${id.charAt(0).toUpperCase() + id.slice(1)} account has been disconnected.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" /> Social Media Accounts
          </CardTitle>
          <CardDescription>
            Connect your social media accounts to enhance your profile visibility and credibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {socialAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full text-white ${account.color}`}>
                    {account.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{account.platform}</h3>
                    {account.connected ? (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-1">@{account.username}</span>
                        {account.verified && (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    )}
                  </div>
                </div>
                
                {account.connected ? (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(account.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleConnect(account.id)}
                    variant="default"
                    size="sm"
                  >
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" /> Visibility Settings
          </CardTitle>
          <CardDescription>
            Control how your social media profiles are displayed on your JobMate profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Show Social Profiles on Marketplace</h3>
                <p className="text-sm text-muted-foreground">Display your connected social accounts on your public profile</p>
              </div>
              <Switch 
                checked={showProfileOnMarketplace}
                onCheckedChange={setShowProfileOnMarketplace}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Share New Jobs</h3>
                <p className="text-sm text-muted-foreground">Automatically share your new job listings to connected social accounts</p>
              </div>
              <Switch 
                checked={autoShareJobs}
                onCheckedChange={setAutoShareJobs}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Share Positive Reviews</h3>
                <p className="text-sm text-muted-foreground">Automatically share 4+ star reviews to connected social accounts</p>
              </div>
              <Switch 
                checked={autoShareReviews}
                onCheckedChange={setAutoShareReviews}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" /> Social Growth Tips
          </CardTitle>
          <CardDescription>
            Recommendations to grow your professional presence on social media
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" /> LinkedIn Tip
              </h3>
              <p className="text-sm">Share your completed projects with before/after photos to showcase your skills to potential clients.</p>
            </div>
            
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-pink-500" /> Instagram Tip
              </h3>
              <p className="text-sm">Use relevant hashtags like #homeimprovement or #professionalplumber to reach more potential customers.</p>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Youtube className="h-4 w-4 mr-2 text-red-600" /> YouTube Tip
              </h3>
              <p className="text-sm">Create short how-to videos to demonstrate your expertise and attract clients looking for your specific skills.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Social Media Growth Tips
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
