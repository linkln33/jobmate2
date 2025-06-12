import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Types
type VisitorData = {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
};

type ServicePopularity = {
  service: string;
  views: number;
  inquiries: number;
  bookings: number;
};

type ConversionData = {
  source: string;
  visitors: number;
  conversions: number;
  rate: number;
};

const Analytics: React.FC = () => {
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [servicePopularity, setServicePopularity] = useState<ServicePopularity[]>([]);
  const [conversionData, setConversionData] = useState<ConversionData[]>([]);
  const [analyticsConnected, setAnalyticsConnected] = useState(false);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Check if analytics is connected
        const { data: config } = await supabase
          .from('analytics_config')
          .select('*')
          .single();
        
        setAnalyticsConnected(!!config);

        // In a real implementation, we would fetch actual data from an analytics API
        // For now, we'll generate mock data
        generateMockData(dateRange);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange, supabase]);

  // Generate mock data for demonstration
  const generateMockData = (range: '7d' | '30d' | '90d') => {
    // Generate visitor data
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const visitors: VisitorData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const baseVisitors = Math.floor(Math.random() * 50) + 20;
      
      visitors.push({
        date: date.toISOString().split('T')[0],
        visitors: baseVisitors,
        pageViews: baseVisitors * (Math.random() * 2 + 1.5),
        uniqueVisitors: baseVisitors * 0.7,
      });
    }
    
    // Generate service popularity data
    const services = [
      'Emergency Plumbing',
      'Drain Cleaning',
      'Water Heater Installation',
      'Pipe Repair',
      'Bathroom Remodeling',
      'Kitchen Plumbing',
    ];
    
    const popularity: ServicePopularity[] = services.map(service => ({
      service,
      views: Math.floor(Math.random() * 500) + 100,
      inquiries: Math.floor(Math.random() * 50) + 10,
      bookings: Math.floor(Math.random() * 20) + 5,
    }));
    
    // Generate conversion data
    const sources = [
      'Direct',
      'Google Search',
      'Social Media',
      'Referral',
      'Email Campaign',
    ];
    
    const conversions: ConversionData[] = sources.map(source => {
      const visitors = Math.floor(Math.random() * 500) + 100;
      const convs = Math.floor(Math.random() * visitors * 0.2);
      return {
        source,
        visitors,
        conversions: convs,
        rate: parseFloat((convs / visitors * 100).toFixed(2)),
      };
    });
    
    setVisitorData(visitors);
    setServicePopularity(popularity.sort((a, b) => b.bookings - a.bookings));
    setConversionData(conversions.sort((a, b) => b.rate - a.rate));
  };

  // Connect analytics
  const connectAnalytics = async () => {
    try {
      // In a real implementation, this would connect to Google Analytics or similar
      await supabase.from('analytics_config').upsert({ 
        id: 1,
        provider: 'google_analytics',
        connected: true,
        updated_at: new Date().toISOString()
      });
      
      setAnalyticsConnected(true);
    } catch (error) {
      console.error('Error connecting analytics:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">
            Track website performance and visitor behavior
          </p>
        </div>
        
        <div className="p-6">
          {/* Analytics Connection */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Google Analytics Integration</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Connect your Google Analytics account to view website analytics
                </p>
              </div>
              
              {analyticsConnected ? (
                <div className="flex items-center">
                  <span className="mr-2 flex h-3 w-3">
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
              ) : (
                <button
                  onClick={connectAnalytics}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Connect Analytics
                </button>
              )}
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDateRange('7d')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  dateRange === '7d'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateRange('30d')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  dateRange === '30d'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setDateRange('90d')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  dateRange === '90d'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Last 90 Days
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Traffic Overview */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Total Visitors</h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {visitorData.reduce((sum, day) => sum + day.visitors, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last {dateRange === '7d' ? '7' : dateRange === '30d' ? '30' : '90'} days
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Page Views</h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(visitorData.reduce((sum, day) => sum + day.pageViews, 0)).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last {dateRange === '7d' ? '7' : dateRange === '30d' ? '30' : '90'} days
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Avg. Session Duration</h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(Math.random() * 2) + 1}m {Math.floor(Math.random() * 60)}s
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last {dateRange === '7d' ? '7' : dateRange === '30d' ? '30' : '90'} days
                  </p>
                </div>
              </div>

              {/* Traffic Chart (Placeholder) */}
              <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2 text-gray-500">
                    Traffic chart visualization would appear here
                  </p>
                  <p className="text-sm text-gray-400">
                    (In production, this would be an actual chart showing visitor trends)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Popularity */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Service Popularity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inquiries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {servicePopularity.map((service, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.views.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.inquiries.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.bookings.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {((service.bookings / service.views) * 100).toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Sources & Conversion */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources & Conversion</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conversionData.map((source, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{source.source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{source.visitors.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{source.conversions.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{source.rate}%</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
              <li>Integration with Google Analytics or similar analytics provider</li>
              <li>Real-time data visualization with charts and graphs</li>
              <li>Custom date range selection</li>
              <li>Exportable reports</li>
              <li>Goal tracking and conversion funnels</li>
              <li>User behavior analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
