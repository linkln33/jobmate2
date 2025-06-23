"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, History, Plus, AlertCircle } from 'lucide-react';

export function UnifiedFinancePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 1250.75,
    pendingPayments: 350.00,
    transactions: [
      { id: "tx1", type: "payment", amount: 125.00, date: "2023-05-18", description: "Payment for plumbing repair" },
      { id: "tx2", type: "withdrawal", amount: -500.00, date: "2023-05-10", description: "Withdrawal to bank account" },
      { id: "tx3", type: "payment", amount: 85.50, date: "2023-05-05", description: "Payment for electrical work" }
    ],
    escrowTransactions: [
      { 
        id: "es1", 
        jobId: "job123",
        jobTitle: "Kitchen Renovation",
        amount: 750.00, 
        status: "funded", 
        date: "2023-05-20", 
        provider: "John Carpenter",
        completionDate: "2023-06-10"
      },
      { 
        id: "es2", 
        jobId: "job456",
        jobTitle: "Bathroom Plumbing Repair",
        amount: 350.00, 
        status: "pending", 
        date: "2023-05-25", 
        provider: "Mike Plumber",
        completionDate: "2023-06-05"
      },
      { 
        id: "es3", 
        jobId: "job789",
        jobTitle: "Electrical Wiring",
        amount: 425.00, 
        status: "released", 
        date: "2023-05-01", 
        provider: "Sarah Electrician",
        completionDate: "2023-05-15"
      },
      { 
        id: "es4", 
        jobId: "job101",
        jobTitle: "Fence Installation",
        amount: 1200.00, 
        status: "disputed", 
        date: "2023-04-28", 
        provider: "Fence Masters LLC",
        completionDate: "2023-05-20",
        disputeReason: "Incomplete work"
      }
    ]
  });

  useEffect(() => {
    // No artificial delay
    setIsLoading(false);
  }, []);

  return (
    <UnifiedDashboardLayout title="Finance" hideSidebar={false} showMap={false} isPublicPage={false}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Finance</h1>
        
        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="escrow">Escrow</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4 text-brand-500" />
                    <span className="text-2xl font-bold">{formatCurrency(walletData.balance)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-2xl font-bold">{formatCurrency(walletData.pendingPayments)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <ArrowUpRight className="mr-1 h-4 w-4" /> Withdraw
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <ArrowDownLeft className="mr-1 h-4 w-4" /> Deposit
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Transaction History</CardTitle>
                  <Button variant="ghost" size="sm">
                    <History className="mr-1 h-4 w-4" /> View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Credit Card */}
                  <div className="flex justify-between items-center border p-4 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="mr-3 h-5 w-5" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  
                  {/* Available Payment Methods */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Available Payment Methods</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* PayPal */}
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="h-12 w-12 flex items-center justify-center mb-2">
                          <img src="/images/payment/paypal.png" alt="PayPal" className="h-8 object-contain" />
                        </div>
                        <p className="text-sm font-medium">PayPal</p>
                      </div>
                      
                      {/* Revolut */}
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="h-12 w-12 flex items-center justify-center mb-2">
                          <img src="/images/payment/revolut.png" alt="Revolut" className="h-8 object-contain" />
                        </div>
                        <p className="text-sm font-medium">Revolut</p>
                      </div>
                      
                      {/* Stripe */}
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="h-12 w-12 flex items-center justify-center mb-2">
                          <img src="/images/payment/stripe.png" alt="Stripe" className="h-8 object-contain" />
                        </div>
                        <p className="text-sm font-medium">Stripe</p>
                      </div>
                      
                      {/* Bitcoin */}
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="h-12 w-12 flex items-center justify-center mb-2">
                          <img src="/images/payment/bitcoin.png" alt="Bitcoin" className="h-8 object-contain" />
                        </div>
                        <p className="text-sm font-medium">Bitcoin</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="escrow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Escrows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-2xl font-bold">{formatCurrency(walletData.escrowTransactions
                      .filter(t => t.status === 'funded' || t.status === 'pending')
                      .reduce((sum, t) => sum + t.amount, 0))}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Released Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <ArrowDownLeft className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">{formatCurrency(walletData.escrowTransactions
                      .filter(t => t.status === 'released')
                      .reduce((sum, t) => sum + t.amount, 0))}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Disputed Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-2xl font-bold">{formatCurrency(walletData.escrowTransactions
                      .filter(t => t.status === 'disputed')
                      .reduce((sum, t) => sum + t.amount, 0))}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Escrow Transactions</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      All
                    </Button>
                    <Button variant="outline" size="sm">
                      Active
                    </Button>
                    <Button variant="outline" size="sm">
                      Completed
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletData.escrowTransactions.map((escrow) => (
                    <div key={escrow.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{escrow.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">Provider: {escrow.provider}</p>
                        </div>
                        <Badge 
                          variant={
                            escrow.status === 'funded' ? 'secondary' : 
                            escrow.status === 'released' ? 'success' : 
                            escrow.status === 'disputed' ? 'destructive' : 
                            'outline'
                          }
                        >
                          {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">Amount: <span className="font-medium">{formatCurrency(escrow.amount)}</span></p>
                          <p className="text-xs text-muted-foreground">Created: {escrow.date} • Due: {escrow.completionDate}</p>
                        </div>
                        <div className="flex gap-2">
                          {escrow.status === 'funded' && (
                            <Button size="sm" variant="outline">Release</Button>
                          )}
                          {escrow.status === 'funded' && (
                            <Button size="sm" variant="outline">Dispute</Button>
                          )}
                          {escrow.status === 'pending' && (
                            <Button size="sm">Fund</Button>
                          )}
                          <Button size="sm" variant="ghost">Details</Button>
                        </div>
                      </div>
                      {escrow.status === 'disputed' && escrow.disputeReason && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded">
                          <p className="font-medium">Dispute Reason:</p>
                          <p>{escrow.disputeReason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>Manage your linked bank accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border p-4 rounded-lg">
                    <div>
                      <p className="font-medium">Chase Bank</p>
                      <p className="text-sm text-muted-foreground">Account ending in 6789</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> Link Bank Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedDashboardLayout>
  );
}
