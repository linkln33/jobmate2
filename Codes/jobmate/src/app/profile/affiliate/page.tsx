"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, Users, DollarSign, Award, Share2, TrendingUp, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export default function AffiliateProgram() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [referralCode, setReferralCode] = useState("JOBMATE" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [referralLink, setReferralLink] = useState("");
  
  // Mock data for the affiliate dashboard
  const mockAffiliateData = {
    tier: {
      name: "Silver",
      progress: 65,
      nextTier: "Gold",
      requiredReferrals: 500,
      currentReferrals: 325,
      bonusRate: 5
    },
    stats: {
      totalReferrals: 325,
      activeReferrals: 287,
      pendingReferrals: 12,
      totalEarnings: 1250.75,
      availableBalance: 450.25,
      pendingBalance: 175.50,
      conversionRate: 8.5
    },
    badges: [
      { name: "First 10 Referrals", achieved: true, image: "🥉" },
      { name: "Top 10 Referrer This Month", achieved: true, image: "🏆" },
      { name: "Service Influencer", achieved: false, image: "🌟" },
      { name: "Referral Champion", achieved: false, image: "👑" }
    ],
    recentReferrals: [
      { name: "John Doe", date: "2025-06-15", status: "active", earnings: 25.00 },
      { name: "Jane Smith", date: "2025-06-14", status: "pending", earnings: 0 },
      { name: "Mike Johnson", date: "2025-06-12", status: "active", earnings: 15.50 },
      { name: "Sarah Williams", date: "2025-06-10", status: "active", earnings: 30.25 }
    ]
  };
  
  useEffect(() => {
    // Generate referral link based on user ID and referral code
    const baseUrl = window.location.origin;
    setReferralLink(`${baseUrl}/signup?ref=${referralCode}`);
  }, [referralCode]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Affiliate Program</h1>
          <p className="text-muted-foreground">
            Earn rewards by referring new users and specialists to JobMate
          </p>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">My Referrals</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="tools">Referral Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">{mockAffiliateData.stats.totalReferrals}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">${mockAffiliateData.stats.totalEarnings.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">{mockAffiliateData.stats.conversionRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tier Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Tier</CardTitle>
                <CardDescription>
                  You are currently at the {mockAffiliateData.tier.name} tier. Refer more users to unlock {mockAffiliateData.tier.nextTier} tier.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-yellow-500" />
                      <span className="font-medium">{mockAffiliateData.tier.name} Tier</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      +{mockAffiliateData.tier.bonusRate}% Bonus
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{mockAffiliateData.tier.currentReferrals} referrals</span>
                      <span>{mockAffiliateData.tier.requiredReferrals} referrals needed for {mockAffiliateData.tier.nextTier}</span>
                    </div>
                    <Progress value={mockAffiliateData.tier.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Share */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Share</CardTitle>
                <CardDescription>
                  Share your referral link to start earning rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Your Referral Code</label>
                  <div className="flex">
                    <Input value={referralCode} readOnly className="rounded-r-none" />
                    <Button 
                      variant="secondary" 
                      className="rounded-l-none"
                      onClick={() => copyToClipboard(referralCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Your Referral Link</label>
                  <div className="flex">
                    <Input value={referralLink} readOnly className="rounded-r-none" />
                    <Button 
                      variant="secondary" 
                      className="rounded-l-none"
                      onClick={() => copyToClipboard(referralLink)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Create Custom Link
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="referrals" className="space-y-6">
            {/* Referral Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">{mockAffiliateData.stats.totalReferrals}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">{mockAffiliateData.stats.activeReferrals}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold">{mockAffiliateData.stats.pendingReferrals}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{mockAffiliateData.stats.conversionRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Referral List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>
                  Track the status and performance of your referrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-3 border-b bg-muted/50">
                    <div className="font-medium">Name</div>
                    <div className="font-medium">Date</div>
                    <div className="font-medium">Status</div>
                    <div className="font-medium text-right">Earnings</div>
                  </div>
                  {mockAffiliateData.recentReferrals.map((referral, index) => (
                    <div key={index} className="grid grid-cols-4 p-3 border-b last:border-0">
                      <div>{referral.name}</div>
                      <div>{referral.date}</div>
                      <div>
                        <Badge variant={referral.status === 'active' ? 'success' : 'outline'} className={referral.status === 'active' ? 'bg-green-500' : ''}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        {referral.earnings > 0 ? `$${referral.earnings.toFixed(2)}` : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Referrals</Button>
              </CardFooter>
            </Card>
            
            {/* Referral Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Performance</CardTitle>
                <CardDescription>
                  Track your referral performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Referral performance chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-6">
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">${mockAffiliateData.stats.totalEarnings.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">${mockAffiliateData.stats.availableBalance.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold">${mockAffiliateData.stats.pendingBalance.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Earnings History */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
                <CardDescription>
                  Track your affiliate earnings over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-3 border-b bg-muted/50">
                    <div className="font-medium">Referral</div>
                    <div className="font-medium">Date</div>
                    <div className="font-medium">Status</div>
                    <div className="font-medium text-right">Amount</div>
                  </div>
                  {mockAffiliateData.recentReferrals.filter(r => r.earnings > 0).map((earning, index) => (
                    <div key={index} className="grid grid-cols-4 p-3 border-b last:border-0">
                      <div>{earning.name}</div>
                      <div>{earning.date}</div>
                      <div>
                        <Badge variant="success" className="bg-green-500">
                          Paid
                        </Badge>
                      </div>
                      <div className="text-right">
                        ${earning.earnings.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Transactions</Button>
              </CardFooter>
            </Card>
            
            {/* Withdraw Funds */}
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Transfer your available balance to your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">Available for withdrawal</p>
                    <p className="text-2xl font-bold">${mockAffiliateData.stats.availableBalance.toFixed(2)}</p>
                  </div>
                  <Button disabled={mockAffiliateData.stats.availableBalance <= 0}>
                    Withdraw
                  </Button>
                </div>
                
                <div className="rounded-md border p-4">
                  <p className="font-medium mb-2">Withdrawal Methods</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/10 hover:bg-muted/20 cursor-pointer">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-500 font-bold">P</span>
                        </div>
                        <span>PayPal</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Connected</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/10 hover:bg-muted/20 cursor-pointer">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-500 font-bold">B</span>
                        </div>
                        <span>Bank Transfer</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Not connected</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-6">
            {/* Marketing Materials */}
            <Card>
              <CardHeader>
                <CardTitle>Marketing Materials</CardTitle>
                <CardDescription>
                  Use these pre-designed materials to promote JobMate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <p className="text-white font-bold">Banner 1</p>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-sm">Social Media Banner</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard('Banner 1 URL')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                      <p className="text-white font-bold">Banner 2</p>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-sm">Email Banner</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard('Banner 2 URL')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <p className="text-white font-bold">Banner 3</p>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-sm">Website Banner</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard('Banner 3 URL')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Marketing Materials</Button>
              </CardFooter>
            </Card>
            
            {/* Custom Link Generator */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Link Generator</CardTitle>
                <CardDescription>
                  Create custom referral links for specific services or campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Link Type</label>
                    <select className="w-full p-2 rounded-md border">
                      <option value="user">User Referral</option>
                      <option value="service">Service Referral</option>
                      <option value="campaign">Campaign Referral</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Code (Optional)</label>
                    <Input placeholder="Enter custom code" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Service (Optional)</label>
                  <select className="w-full p-2 rounded-md border">
                    <option value="">Select a service</option>
                    <option value="1">Home Cleaning</option>
                    <option value="2">Garden Maintenance</option>
                    <option value="3">Plumbing Services</option>
                    <option value="4">Electrical Work</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Commission Rate</label>
                  <div className="flex items-center">
                    <Input type="number" defaultValue="10" min="0" max="30" className="rounded-r-none" />
                    <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md">%</div>
                  </div>
                  <p className="text-xs text-muted-foreground">Commission rate between 0-30%</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Generate Custom Link</Button>
              </CardFooter>
            </Card>
            
            {/* Social Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>Social Sharing</CardTitle>
                <CardDescription>
                  Share your referral link on social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    Facebook
                  </Button>
                  
                  <Button variant="outline" className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">t</span>
                    </div>
                    Twitter
                  </Button>
                  
                  <Button variant="outline" className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-700 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">in</span>
                    </div>
                    LinkedIn
                  </Button>
                  
                  <Button variant="outline" className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">w</span>
                    </div>
                    WhatsApp
                  </Button>
                  
                  <Button variant="outline" className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">e</span>
                    </div>
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
