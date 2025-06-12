import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Types
type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
};

const Bookings: React.FC = () => {
  const { supabase } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      
      // Apply filter if not 'all'
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load bookings. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));
      
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
      
      setMessage({
        type: 'success',
        text: `Booking status updated to ${status}`,
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update booking status. Please try again.',
      });
    }
  };

  // Handle booking deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.filter(booking => booking.id !== id));
      
      if (selectedBooking?.id === id) {
        setIsModalOpen(false);
        setSelectedBooking(null);
      }
      
      setMessage({
        type: 'success',
        text: 'Booking deleted successfully',
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete booking. Please try again.',
      });
    }
  };

  // Open booking details modal
  const openBookingModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Format created at date
  const formatCreatedAt = (dateString: string) => {
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.name.toLowerCase().includes(searchLower) ||
      booking.email.toLowerCase().includes(searchLower) ||
      booking.service.toLowerCase().includes(searchLower) ||
      booking.message.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Booking Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            View and manage customer booking requests
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setFilter('all'); fetchBookings(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setFilter('pending'); fetchBookings(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => { setFilter('confirmed'); fetchBookings(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'confirmed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => { setFilter('completed'); fetchBookings(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'completed'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => { setFilter('cancelled'); fetchBookings(); }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'cancelled'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Cancelled
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-md ${
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

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm
              ? 'No bookings found matching your search.'
              : 'No bookings found. When customers submit booking requests, they will appear here.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                          <div className="text-sm text-gray-500">{booking.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(booking.preferred_date)}</div>
                      <div className="text-sm text-gray-500">{formatTime(booking.preferred_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCreatedAt(booking.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openBookingModal(booking)}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Client Information</h4>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Name:</span> {selectedBooking.name}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Email:</span> {selectedBooking.email}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Phone:</span> {selectedBooking.phone}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Booking Information</h4>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Service:</span> {selectedBooking.service}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Date:</span> {formatDate(selectedBooking.preferred_date)}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Time:</span> {formatTime(selectedBooking.preferred_time)}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Submitted:</span> {formatCreatedAt(selectedBooking.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="mt-2 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedBooking.message || 'No message provided.'}
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'pending')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBooking.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBooking.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBooking.status === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => handleDelete(selectedBooking.id)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                >
                  Delete Booking
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
