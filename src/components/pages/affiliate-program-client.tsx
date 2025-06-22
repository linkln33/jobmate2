"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, Users, DollarSign, Award, Share2, TrendingUp, Link as LinkIcon, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";

export function AffiliateProgramClient() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [referralCode, setReferralCode] = useState("JOBMATE" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [referralLink, setReferralLink] = useState("");
  
  // Mock data for the affiliate dashboard
  const affiliateStats = {
    referrals: 42,
    activeReferrals: 28,
    earnings: 1250.75,
    pendingEarnings: 350.25,
    conversionRate: 66.7,
    nextPayout: "2025-07-15",
    payoutThreshold: 100,
    tierLevel: "Gold",
    tierProgress: 85,
  };

  // Recent referrals mock data
  const recentReferrals = [
    { id: 1, name: "John Smith", date: "2025-06-15", status: "active", commission: 45.00 },
    { id: 2, name: "Sarah Johnson", date: "2025-06-12", status: "active", commission: 45.00 },
    { id: 3, name: "Michael Brown", date: "2025-06-10", status: "pending", commission: 45.00 },
    { id: 4, name: "Emily Davis", date: "2025-06-05", status: "active", commission: 45.00 },
    { id: 5, name: "Robert Wilson", date: "2025-05-28", status: "inactive", commission: 30.00 },
  ];

  // Payment history mock data
  const paymentHistory = [
    { id: 1, amount: 450.00, date: "2025-05-15", method: "Bank Transfer", status: "completed" },
    { id: 2, amount: 325.50, date: "2025-04-15", method: "PayPal", status: "completed" },
    { id: 3, amount: 275.25, date: "2025-03-15", method: "Bank Transfer", status: "completed" },
    { id: 4, amount: 200.00, date: "2025-02-15", method: "PayPal", status: "completed" },
  ];

  useEffect(() => {
    // Set referral link based on user and referral code
    setReferralLink(`https://jobmate.com/signup?ref=${referralCode}`);
  }, [referralCode]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const shareReferral = (platform: string) => {
    // In a real app, this would integrate with social sharing APIs
    toast.success(`Sharing referral link on ${platform}!`);
  };

  return (
    <UnifiedDashboardLayout showMap={false}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Affiliate Program</h1>
              <p className="text-muted-foreground">Earn rewards by referring new users to JobMate</p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-lg">
              {affiliateStats.tierLevel} Tier
            </Badge>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Total Referrals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{affiliateStats.referrals}</div>
                    <p className="text-sm text-muted-foreground">
                      {affiliateStats.activeReferrals} active users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <DollarSign className="mr-2 h-5 w-5 text-primary" />
                      Total Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${affiliateStats.earnings.toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">
                      ${affiliateStats.pendingEarnings.toFixed(2)} pending
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Award className="mr-2 h-5 w-5 text-primary" />
                      Conversion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{affiliateStats.conversionRate}%</div>
                    <p className="text-sm text-muted-foreground">
                      Industry avg: 35%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tier Progress</CardTitle>
                  <CardDescription>
                    You are {100 - affiliateStats.tierProgress}% away from reaching the next tier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={affiliateStats.tierProgress} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm">
                    <span>Current: {affiliateStats.tierLevel}</span>
                    <span>Next: Platinum</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Link</CardTitle>
                  <CardDescription>
                    Share this link to earn commission on new sign-ups
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={referralCode} 
                      readOnly 
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={() => copyToClipboard(referralCode, "Referral code")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" onClick={() => copyToClipboard(referralLink, "Referral link")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" onClick={() => shareReferral("Email")}>
                      Share via Email
                    </Button>
                    <Button variant="outline" onClick={() => shareReferral("Twitter")}>
                      Share on Twitter
                    </Button>
                    <Button variant="outline" onClick={() => shareReferral("LinkedIn")}>
                      Share on LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Referrals</CardTitle>
                  <CardDescription>
                    Track the status of your recent referrals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReferrals.map((referral) => (
                          <tr key={referral.id} className="border-b">
                            <td className="py-3 px-4">{referral.name}</td>
                            <td className="py-3 px-4">{referral.date}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={
                                  referral.status === "active" ? "success" : 
                                  referral.status === "pending" ? "warning" : "secondary"
                                }
                              >
                                {referral.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">${referral.commission.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="ml-auto">
                    View All Referrals <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Track your affiliate earnings and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Method</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="py-3 px-4">{payment.date}</td>
                            <td className="py-3 px-4">{payment.method}</td>
                            <td className="py-3 px-4">
                              <Badge variant="success">{payment.status}</Badge>
                            </td>
                            <td className="py-3 px-4 text-right">${payment.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next payout: {affiliateStats.nextPayout}</p>
                    <p className="text-sm text-muted-foreground">Minimum threshold: ${affiliateStats.payoutThreshold}</p>
                  </div>
                  <Button variant="outline">
                    Payment Settings <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Resources</CardTitle>
                  <CardDescription>
                    Tools and materials to help you promote JobMate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Banners & Graphics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Download ready-to-use marketing graphics for your website or social media
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">Download Assets</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Email Templates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Pre-written email templates to send to potential referrals
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">View Templates</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Affiliate FAQ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Common questions about the JobMate affiliate program
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">Read FAQ</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Program Terms</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Terms and conditions for the JobMate affiliate program
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">View Terms</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
