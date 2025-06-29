import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert, CircularProgress } from '@mui/material';
import { CalendarIcon } from 'lucide-react';
import GoogleCalendarIntegration from '@/components/shared/google-calendar-integration';
import { AvailabilitySettings } from '@/components/shared/availability-calendar';
import { calendarService } from '@/services/calendar-service';

interface ListingAvailabilityProps {
  listingId: string;
  listingTitle: string;
  initialAvailability?: AvailabilitySettings;
  onAvailabilityChange?: (availability: AvailabilitySettings) => void;
  viewOnly?: boolean;
  onBookingRequested?: (selectedSlot: Date) => void;
}

const DEFAULT_AVAILABILITY: AvailabilitySettings = {
  availableDays: [],
  recurringPattern: 'none',
  exceptions: []
};

const ListingAvailability: React.FC<ListingAvailabilityProps> = ({
  listingId,
  listingTitle,
  initialAvailability = DEFAULT_AVAILABILITY,
  onAvailabilityChange,
  viewOnly = false,
  onBookingRequested
}) => {
  const [availability, setAvailability] = useState<AvailabilitySettings>(initialAvailability);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  // Handle availability change
  const handleAvailabilityChange = (newAvailability: AvailabilitySettings) => {
    setAvailability(newAvailability);
    if (onAvailabilityChange) {
      onAvailabilityChange(newAvailability);
    }
  };

  // Handle booking request
  const handleBookingRequest = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create a calendar event for the booking
      if (calendarService.isUserAuthenticated()) {
        const endTime = new Date(selectedSlot);
        endTime.setHours(endTime.getHours() + 1); // Default 1-hour meeting
        
        const eventId = await calendarService.createEvent({
          title: `Booking: ${listingTitle}`,
          description: `Booking for listing #${listingId}`,
          startTime: selectedSlot,
          endTime: endTime,
        });
        
        setSuccess(`Booking confirmed and added to your calendar!`);
        
        // Notify parent component
        if (onBookingRequested) {
          onBookingRequested(selectedSlot);
        }
      } else {
        setError('Please connect your Google Calendar first');
      }
    } catch (err: any) {
      setError(`Booking failed: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Find available slots from the availability settings
  const findAvailableSlots = () => {
    if (!availability || !availability.availableDays || availability.availableDays.length === 0) {
      return [];
    }

    const slots: Date[] = [];
    
    // For each available day
    availability.availableDays.forEach(day => {
      const dayDate = new Date(day.date);
      
      // For each time slot in that day
      day.timeSlots.forEach(slotId => {
        // Get the time slot details
        const timeSlot = TIME_SLOTS.find(slot => slot.id === slotId);
        if (!timeSlot) return;
        
        // Create start time for this slot
        const [startHour, startMinute] = timeSlot.startTime.split(':').map(Number);
        const slotTime = new Date(dayDate);
        slotTime.setHours(startHour, startMinute, 0);
        
        // Add 30-minute intervals within this time slot
        const [endHour, endMinute] = timeSlot.endTime.split(':').map(Number);
        const endTime = new Date(dayDate);
        endTime.setHours(endHour, endMinute, 0);
        
        // Handle overnight slots
        if (endTime < slotTime) {
          endTime.setDate(endTime.getDate() + 1);
        }
        
        let currentTime = new Date(slotTime);
        while (currentTime < endTime) {
          slots.push(new Date(currentTime));
          // Add 30 minutes
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
      });
    });
    
    return slots;
  };

  // Get available slots
  const availableSlots = findAvailableSlots();

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
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
        <Typography variant="h6">
          {viewOnly ? 'Available Times' : 'Set Your Availability'}
        </Typography>
      </Box>
      
      <GoogleCalendarIntegration
        availability={availability}
        onAvailabilityChange={handleAvailabilityChange}
        eventTitle={`${listingTitle} - Availability`}
        eventDescription={`Availability for listing: ${listingTitle} (ID: ${listingId})`}
        showExportButton={!viewOnly}
        showImportButton={!viewOnly}
      />
      
      {viewOnly && availableSlots.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Book a Time Slot
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {availableSlots.slice(0, 10).map((slot, index) => (
              <Button
                key={index}
                variant={selectedSlot && selectedSlot.getTime() === slot.getTime() ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedSlot(slot)}
                sx={{ minWidth: '120px' }}
              >
                {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Button>
            ))}
            {availableSlots.length > 10 && (
              <Typography variant="body2" color="text.secondary">
                +{availableSlots.length - 10} more slots available
              </Typography>
            )}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedSlot || loading}
            onClick={handleBookingRequest}
            startIcon={loading ? <CircularProgress size={20} /> : <CalendarIcon size={20} />}
          >
            Book This Time
          </Button>
        </Box>
      )}
    </Paper>
  );
};

// Time slots constants (same as in availability-calendar.tsx)
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', startTime: '08:00', endTime: '12:00' },
  { id: 'afternoon', label: 'Afternoon', startTime: '12:00', endTime: '17:00' },
  { id: 'evening', label: 'Evening', startTime: '17:00', endTime: '21:00' },
  { id: 'night', label: 'Night', startTime: '21:00', endTime: '08:00' },
];

export default ListingAvailability;
