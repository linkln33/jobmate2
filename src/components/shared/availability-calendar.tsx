import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Checkbox, 
  FormControlLabel, 
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Button,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, addDays, isSameDay } from 'date-fns';

// Types
export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
}

export interface DayAvailability {
  date: Date;
  timeSlots: string[]; // Array of timeSlot IDs
}

export interface AvailabilitySettings {
  availableDays: DayAvailability[];
  recurringPattern: 'none' | 'weekly' | 'monthly';
  exceptions: Date[]; // Dates that override the recurring pattern
}

interface AvailabilityCalendarProps {
  value: AvailabilitySettings;
  onChange: (value: AvailabilitySettings) => void;
}

// Constants
const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning', label: 'Morning', startTime: '08:00', endTime: '12:00' },
  { id: 'afternoon', label: 'Afternoon', startTime: '12:00', endTime: '17:00' },
  { id: 'evening', label: 'Evening', startTime: '17:00', endTime: '21:00' },
  { id: 'night', label: 'Night', startTime: '21:00', endTime: '08:00' },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedView, setSelectedView] = useState<'daily' | 'recurring'>('daily');

  // Find availability for the selected date
  const findDayAvailability = (date: Date): DayAvailability | undefined => {
    return value.availableDays.find(day => 
      date && isSameDay(new Date(day.date), date)
    );
  };

  // Get time slots for the selected date
  const getSelectedDateTimeSlots = (): string[] => {
    if (!selectedDate) return [];
    const dayAvailability = findDayAvailability(selectedDate);
    return dayAvailability?.timeSlots || [];
  };

  // Handle time slot toggle
  const handleTimeSlotToggle = (timeSlotId: string) => {
    if (!selectedDate) return;

    const currentTimeSlots = getSelectedDateTimeSlots();
    let newTimeSlots: string[];

    if (currentTimeSlots.includes(timeSlotId)) {
      newTimeSlots = currentTimeSlots.filter(id => id !== timeSlotId);
    } else {
      newTimeSlots = [...currentTimeSlots, timeSlotId];
    }

    const dayAvailability = findDayAvailability(selectedDate);
    let newAvailableDays: DayAvailability[];

    if (dayAvailability) {
      // Update existing day
      newAvailableDays = value.availableDays.map(day => 
        isSameDay(new Date(day.date), selectedDate) 
          ? { ...day, timeSlots: newTimeSlots }
          : day
      );
    } else {
      // Add new day
      newAvailableDays = [
        ...value.availableDays,
        { date: selectedDate, timeSlots: newTimeSlots }
      ];
    }

    onChange({
      ...value,
      availableDays: newAvailableDays
    });
  };

  // Handle recurring pattern change
  const handleRecurringPatternChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPattern: 'none' | 'weekly' | 'monthly' | null,
  ) => {
    if (newPattern !== null) {
      onChange({
        ...value,
        recurringPattern: newPattern
      });
    }
  };

  // Handle view change
  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: 'daily' | 'recurring' | null,
  ) => {
    if (newView !== null) {
      setSelectedView(newView);
    }
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // Add exception date
  const handleAddException = () => {
    if (!selectedDate) return;
    
    // Check if date is already an exception
    const isAlreadyException = value.exceptions.some(date => 
      isSameDay(date, selectedDate!)
    );

    if (!isAlreadyException) {
      onChange({
        ...value,
        exceptions: [...value.exceptions, selectedDate]
      });
    }
  };

  // Remove exception date
  const handleRemoveException = (date: Date) => {
    onChange({
      ...value,
      exceptions: value.exceptions.filter(d => !isSameDay(d, date))
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Availability Calendar
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={selectedView}
            exclusive
            onChange={handleViewChange}
            aria-label="availability view"
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="daily" aria-label="daily view">
              Daily
            </ToggleButton>
            <ToggleButton value="recurring" aria-label="recurring view">
              Recurring
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {selectedView === 'daily' && (
          <>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{ width: '100%', mb: 2 }}
            />

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Available Time Slots for {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Selected Date'}
            </Typography>

            <FormGroup>
              <Grid container spacing={1}>
                {TIME_SLOTS.map((slot) => (
                  <Grid item xs={6} sm={3} key={slot.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getSelectedDateTimeSlots().includes(slot.id)}
                          onChange={() => handleTimeSlotToggle(slot.id)}
                        />
                      }
                      label={`${slot.label} (${slot.startTime}-${slot.endTime})`}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Select the time slots when you're available on this date.
              </Typography>
            </Box>
          </>
        )}

        {selectedView === 'recurring' && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Recurring Availability Pattern
            </Typography>
            
            <ToggleButtonGroup
              value={value.recurringPattern}
              exclusive
              onChange={handleRecurringPatternChange}
              aria-label="recurring pattern"
              size="small"
              sx={{ mb: 2 }}
            >
              <StyledToggleButton value="none" aria-label="no recurring">
                None
              </StyledToggleButton>
              <StyledToggleButton value="weekly" aria-label="weekly recurring">
                Weekly
              </StyledToggleButton>
              <StyledToggleButton value="monthly" aria-label="monthly recurring">
                Monthly
              </StyledToggleButton>
            </ToggleButtonGroup>

            {value.recurringPattern !== 'none' && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  {value.recurringPattern === 'weekly' ? 'Weekly Schedule' : 'Monthly Schedule'}
                </Typography>
                
                <Grid container spacing={2}>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 1, 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="subtitle2">{day}</Typography>
                        <Box sx={{ mt: 1 }}>
                          {TIME_SLOTS.map(slot => (
                            <FormControlLabel
                              key={`${day}-${slot.id}`}
                              control={
                                <Checkbox
                                  size="small"
                                />
                              }
                              label={slot.label}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Exceptions
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DatePicker
                    label="Add Exception Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    sx={{ flexGrow: 1, mr: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddException}
                    disabled={!selectedDate}
                  >
                    Add
                  </Button>
                </Box>
                
                {value.exceptions.length > 0 ? (
                  <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {value.exceptions.map((date, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body2">
                          {format(date, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveException(date)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No exceptions added yet.
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default AvailabilityCalendar;
