import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

const Calendar: React.FC = () => {
  const { supabase } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
    checkGoogleConnection();
  }, []);

  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('preferred_date', { ascending: true });

      if (error) throw error;
      
      // Transform bookings to calendar events
      const calendarEvents = data?.map(booking => ({
        id: booking.id,
        title: `${booking.service} - ${booking.name}`,
        start: `${booking.preferred_date}T${booking.preferred_time}`,
        end: `${booking.preferred_date}T${addHoursToTime(booking.preferred_time, 2)}`, // Assume 2 hour duration
        description: booking.message,
        status: booking.status,
      })) || [];
      
      setEvents(calendarEvents);
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

  // Check if Google Calendar is connected
  const checkGoogleConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .single();

      if (error) {
        setGoogleConnected(false);
        return;
      }
      
      setGoogleConnected(!!data);
    } catch (error) {
      console.error('Error checking Google connection:', error);
      setGoogleConnected(false);
    }
  };

  // Helper function to add hours to time string (HH:MM)
  const addHoursToTime = (time: string, hoursToAdd: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setHours(date.getHours() + hoursToAdd);
    
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Connect to Google Calendar
  const connectToGoogle = () => {
    // In a real implementation, this would redirect to Google OAuth
    alert('This would redirect to Google OAuth in a production environment');
    
    // For demo purposes, simulate successful connection
    setGoogleConnected(true);
    setMessage({
      type: 'success',
      text: 'Successfully connected to Google Calendar!',
    });
  };

  // Sync bookings to Google Calendar
  const syncToGoogle = async () => {
    if (!googleConnected) {
      setMessage({
        type: 'error',
        text: 'Please connect to Google Calendar first.',
      });
      return;
    }
    
    // In a real implementation, this would sync events to Google Calendar
    setMessage({
      type: 'success',
      text: 'Bookings successfully synced to Google Calendar!',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Calendar Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your booking calendar and sync with Google Calendar
          </p>
        </div>
        
        <div className="p-6">
          {/* Google Calendar Connection */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Google Calendar Integration</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Connect your Google Calendar to sync bookings automatically
                </p>
              </div>
              
              {googleConnected ? (
                <div className="flex items-center">
                  <span className="mr-2 flex h-3 w-3">
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
              ) : (
                <button
                  onClick={connectToGoogle}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Connect
                </button>
              )}
            </div>
          </div>

          {/* Sync Button */}
          <div className="mb-6">
            <button
              onClick={syncToGoogle}
              disabled={!googleConnected}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                !googleConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Sync Bookings to Google Calendar
            </button>
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

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">Loading calendar events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
              <p className="mt-1 text-sm text-gray-500">
                You have no upcoming bookings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    event.status === 'confirmed'
                      ? 'border-blue-200 bg-blue-50'
                      : event.status === 'completed'
                      ? 'border-green-200 bg-green-50'
                      : event.status === 'cancelled'
                      ? 'border-red-200 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(event.start).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(event.end).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {event.description && (
                        <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : event.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
              <li>Full Google OAuth 2.0 integration for secure authentication</li>
              <li>Proper Google Calendar API integration for two-way sync</li>
              <li>A full calendar view with day/week/month views</li>
              <li>Ability to create and edit events directly on the calendar</li>
              <li>Automatic sync of booking status changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
