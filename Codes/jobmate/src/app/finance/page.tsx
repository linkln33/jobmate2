"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/main-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, History, Plus } from 'lucide-react';

export default function FinancePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const checkAuth = async () => {
        if (!isAuthenticated) {
          router.push('/login');
        } else {
          setIsLoading(false);
        }
      };
      checkAuth();
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mock wallet balance and transactions
  const walletBalance = 1250.75;
  const pendingBalance = 350.25;
  const transactions = [
    { id: 1, type: 'deposit', amount: 500, date: '2025-06-10', status: 'completed', method: 'Stripe', description: 'Job payment' },
    { id: 2, type: 'withdrawal', amount: 200, date: '2025-06-08', status: 'completed', method: 'Bank Transfer', description: 'Withdrawal to bank account' },
    { id: 3, type: 'deposit', amount: 350.25, date: '2025-06-05', status: 'pending', method: 'PayPal', description: 'Client payment' },
    { id: 4, type: 'deposit', amount: 750, date: '2025-06-01', status: 'completed', method: 'Crypto', description: 'Bitcoin payment' },
    { id: 5, type: 'withdrawal', amount: 100, date: '2025-05-28', status: 'completed', method: 'Revolut', description: 'Instant withdrawal' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Finance</h1>
        
        {/* Wallet Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(walletBalance)}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full">Withdraw Funds</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Pending Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(pendingBalance)}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Credit Card</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Connected</span>
                  <div className="flex space-x-1">
                    <img src="/images/payment/visa.png" alt="Visa" className="h-4" />
                    <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-4" />
                    <img src="/images/payment/amex.png" alt="American Express" className="h-4" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/images/payment/paypal.png" alt="PayPal" className="h-4 mr-2" />
                  <span>PayPal</span>
                </div>
                <span className="text-sm text-muted-foreground">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/images/crypto-logo.svg" alt="Crypto" className="h-4 mr-2" />
                  <span>Crypto Wallet</span>
                </div>
                <span className="text-sm text-muted-foreground">Not Connected</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Payment Providers */}
        <h2 className="text-xl font-semibold mb-4">Payment Providers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="h-12 flex items-center justify-center">
              <img src="/images/stripe-logo.svg" alt="Stripe" className="h-8" />
            </div>
          </Card>
          
          <Card className="p-4 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="h-12 flex items-center justify-center">
              <img src="/images/paypal-logo.svg" alt="PayPal" className="h-8" />
            </div>
          </Card>
          
          <Card className="p-4 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="h-12 flex items-center justify-center">
              <img src="/images/revolut-logo.png" alt="Revolut" className="h-8" />
            </div>
          </Card>
          
          <Card className="p-4 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="h-12 flex items-center justify-center">
              <img src="/images/crypto-logo.svg" alt="Crypto" className="h-8" />
            </div>
          </Card>
        </div>
        
        {/* Transactions */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'deposit' ? 
                              <ArrowDownLeft className={`h-5 w-5 ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`} /> : 
                              <ArrowUpRight className={`h-5 w-5 ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`} />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center p-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  <History className="h-4 w-4 mr-2" />
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="deposits" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {transactions.filter(t => t.type === 'deposit').map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full mr-3 bg-green-100">
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            +{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="withdrawals" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {transactions.filter(t => t.type === 'withdrawal').map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full mr-3 bg-red-100">
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">
                            -{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
