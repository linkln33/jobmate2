import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Types
type Payment = {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed';
  payment_method: string;
  created_at: string;
  service: string;
  booking_id?: string;
};

const Payments: React.FC = () => {
  const { supabase } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'succeeded' | 'pending' | 'failed'>('all');

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
    checkStripeConnection();
  }, []);

  // Fetch payments from Supabase
  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase.from('payments').select('*').order('created_at', { ascending: false });
      
      // Apply filter if not 'all'
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load payments. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if Stripe is connected
  const checkStripeConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_config')
        .select('*')
        .single();

      if (error) {
        setStripeConnected(false);
        return;
      }
      
      setStripeConnected(!!data);
    } catch (error) {
      console.error('Error checking Stripe connection:', error);
      setStripeConnected(false);
    }
  };

  // Connect to Stripe
  const connectToStripe = () => {
    // In a real implementation, this would redirect to Stripe OAuth
    alert('This would redirect to Stripe Connect in a production environment');
    
    // For demo purposes, simulate successful connection
    setStripeConnected(true);
    setMessage({
      type: 'success',
      text: 'Successfully connected to Stripe!',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            View and manage customer payments
          </p>
        </div>
        
        <div className="p-6">
          {/* Stripe Connection */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Stripe Integration</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Connect your Stripe account to process payments
                </p>
              </div>
              
              {stripeConnected ? (
                <div className="flex items-center">
                  <span className="mr-2 flex h-3 w-3">
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
              ) : (
                <button
                  onClick={connectToStripe}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Connect Stripe
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setFilter('all'); fetchPayments(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All Payments
              </button>
              <button
                onClick={() => { setFilter('succeeded'); fetchPayments(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'succeeded'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Successful
              </button>
              <button
                onClick={() => { setFilter('pending'); fetchPayments(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => { setFilter('failed'); fetchPayments(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'failed'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Failed
              </button>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No payments found. When customers make payments, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.customer_name}</div>
                          <div className="text-sm text-gray-500">{payment.customer_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Implementation Note */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> In a production environment, this component would include:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Full Stripe API integration for payment processing</li>
              <li>Secure handling of payment information</li>
              <li>Automated invoice generation and sending</li>
              <li>Payment dispute handling</li>
              <li>Refund processing</li>
              <li>Detailed payment analytics and reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
