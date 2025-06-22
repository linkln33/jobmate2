"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, History, Plus } from 'lucide-react';

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
    ]
  });

  useEffect(() => {
    // Simulate loading wallet data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <UnifiedDashboardLayout title="Finance" hideSidebar={false} showMap={false} isPublicPage={false}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Finance</h1>
        
        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center border p-4 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="mr-3 h-5 w-5" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> Add Payment Method
                  </Button>
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
