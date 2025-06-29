import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Calendar as CalendarIcon } from 'lucide-react';
import AvailabilityCalendar, { AvailabilitySettings } from './availability-calendar';
import { calendarService, CalendarEvent } from '@/services/calendar-service';

interface GoogleCalendarIntegrationProps {
  availability: AvailabilitySettings;
  onAvailabilityChange: (availability: AvailabilitySettings) => void;
  eventTitle?: string;
  eventDescription?: string;
  onEventCreated?: (eventId: string) => void;
  showImportButton?: boolean;
  showExportButton?: boolean;
}

const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({
  availability,
  onAvailabilityChange,
  eventTitle = 'JobMate Appointment',
  eventDescription = 'Scheduled via JobMate',
  onEventCreated,
  showImportButton = true,
  showExportButton = true
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiInitialized, setApiInitialized] = useState(false);

  // Initialize Google API on component mount
  useEffect(() => {
    const initApi = async () => {
      try {
        setIsLoading(true);
        const initialized = await calendarService.initializeGoogleApi();
        setApiInitialized(initialized);
        setIsAuthenticated(calendarService.isUserAuthenticated());
      } catch (err) {
        setError('Failed to initialize Google Calendar API');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initApi();
  }, []);

  // Handle Google authentication
  const handleAuthenticate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const authenticated = await calendarService.authenticate();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setSuccess('Successfully connected to Google Calendar');
      } else {
        setError('Authentication failed');
      }
    } catch (err: any) {
      setError(`Authentication error: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    try {
      calendarService.signOut();
      setIsAuthenticated(false);
      setSuccess('Successfully disconnected from Google Calendar');
    } catch (err: any) {
      setError(`Sign out error: ${err.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  // Import events from Google Calendar
  const handleImportEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get start and end dates from availability
      const dates = availability.availableDays.map(day => new Date(day.date));
      if (dates.length === 0) {
        setError('Please select at least one date in the calendar first');
        setIsLoading(false);
        return;
      }
      
      const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
      endDate.setDate(endDate.getDate() + 1); // Include the full day
      
      // Get events from Google Calendar
      const events = await calendarService.getEvents(startDate, endDate);
      
      // Convert events to blocked time slots in availability
      const updatedAvailability = { ...availability };
      
      // Mark busy times as unavailable
      events.forEach(event => {
        const eventDate = new Date(event.startTime);
        const dayIndex = updatedAvailability.availableDays.findIndex(day => 
          isSameDay(new Date(day.date), eventDate)
        );
        
        if (dayIndex >= 0) {
          const day = updatedAvailability.availableDays[dayIndex];
          
          // Find which time slots overlap with this event
          const overlappingSlots = TIME_SLOTS.filter(slot => {
            const [startHour, startMinute] = slot.startTime.split(':').map(Number);
            const [endHour, endMinute] = slot.endTime.split(':').map(Number);
            
            const slotStart = new Date(eventDate);
            slotStart.setHours(startHour, startMinute, 0);
            
            const slotEnd = new Date(eventDate);
            slotEnd.setHours(endHour, endMinute, 0);
            if (slotEnd < slotStart) {
              slotEnd.setDate(slotEnd.getDate() + 1); // Handle overnight slots
            }
            
            // Check for overlap
            return (
              (event.startTime < slotEnd && event.endTime > slotStart) ||
              (slotStart < event.endTime && slotEnd > event.startTime)
            );
          });
          
          // Remove overlapping slots
          updatedAvailability.availableDays[dayIndex].timeSlots = day.timeSlots.filter(
            slotId => !overlappingSlots.some(slot => slot.id === slotId)
          );
        }
      });
      
      onAvailabilityChange(updatedAvailability);
      setSuccess(`Imported ${events.length} events from Google Calendar`);
    } catch (err: any) {
      setError(`Import error: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Export availability to Google Calendar
  const handleExportToCalendar = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert availability to calendar events
      const events = calendarService.convertAvailabilityToEvents(
        availability,
        eventTitle,
        eventDescription
      );
      
      if (events.length === 0) {
        setError('No available time slots to export');
        setIsLoading(false);
        return;
      }
      
      // Create events in Google Calendar
      const createdEventIds: string[] = [];
      
      for (const event of events) {
        const eventId = await calendarService.createEvent(event);
        createdEventIds.push(eventId);
      }
      
      setSuccess(`Successfully exported ${createdEventIds.length} time slots to Google Calendar`);
      
      // Call the callback if provided
      if (onEventCreated && createdEventIds.length > 0) {
        onEventCreated(createdEventIds[0]);
      }
    } catch (err: any) {
      setError(`Export error: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarIcon className="mr-2" />
        <Typography variant="h6">Google Calendar Integration</Typography>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : !apiInitialized ? (
        <Alert severity="warning">
          Google Calendar API could not be initialized. Please check your internet connection.
        </Alert>
      ) : !isAuthenticated ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAuthenticate}
          startIcon={<CalendarIcon />}
          sx={{ mb: 2 }}
        >
          Connect Google Calendar
        </Button>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="success.main">
              ✓ Connected to Google Calendar
            </Typography>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={handleSignOut}
            >
              Disconnect
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {showImportButton && (
              <Button
                variant="outlined"
                onClick={handleImportEvents}
                disabled={isLoading}
              >
                Import Busy Times
              </Button>
            )}
            
            {showExportButton && (
              <Button
                variant="contained"
                onClick={handleExportToCalendar}
                disabled={isLoading}
              >
                Export to Google Calendar
              </Button>
            )}
          </Box>
        </Box>
      )}
      
      <AvailabilityCalendar
        value={availability}
        onChange={onAvailabilityChange}
      />
    </Box>
  );
};

// Time slots constants (same as in availability-calendar.tsx)
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', startTime: '08:00', endTime: '12:00' },
  { id: 'afternoon', label: 'Afternoon', startTime: '12:00', endTime: '17:00' },
  { id: 'evening', label: 'Evening', startTime: '17:00', endTime: '21:00' },
  { id: 'night', label: 'Night', startTime: '21:00', endTime: '08:00' },
];

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default GoogleCalendarIntegration;
