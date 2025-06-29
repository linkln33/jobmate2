import { AvailabilitySettings, DayAvailability } from '@/components/shared/availability-calendar';

// Type declarations for Google API libraries
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

/**
 * Interface for calendar events
 */
export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[]; // Email addresses
  videoConferenceLink?: string;
}

/**
 * Google Calendar API configuration
 */
interface GoogleCalendarConfig {
  clientId: string;
  apiKey: string;
  scopes: string[];
  discoveryDocs: string[];
}

/**
 * Calendar Service for handling Google Calendar integration
 */
export class CalendarService {
  private googleCalendarConfig: GoogleCalendarConfig;
  private isAuthenticated: boolean = false;
  private gapiLoaded: boolean = false;
  private gisLoaded: boolean = false;
  private tokenClient: any = null;

  constructor() {
    // Configuration for Google Calendar API
    this.googleCalendarConfig = {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      apiKey: '', // API key is optional for authenticated requests
      scopes: ['https://www.googleapis.com/auth/calendar'],
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    };
  }

  /**
   * Initialize Google API client
   */
  async initializeGoogleApi(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }
    return this.loadGoogleApis();
  }

  /**
   * Load Google API libraries
   */
  private async loadGoogleApis(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if APIs are already loaded
      if (window.gapi && window.google?.accounts?.oauth2) {
        this.gapiLoaded = true;
        this.gisLoaded = true;
        this.loadGapiClient().then(() => {
          this.initializeTokenClient();
          resolve(true);
        });
        return;
      }
      
      // Load the Google API client library
      const script1 = document.createElement('script');
      script1.src = 'https://apis.google.com/js/api.js';
      script1.onload = () => {
        this.gapiLoaded = true;
        this.loadGapiClient().then(() => {
          if (this.gapiLoaded && this.gisLoaded) {
            this.initializeTokenClient();
            resolve(true);
          }
        });
      };
      document.body.appendChild(script1);
      
      // Load the Google Identity Services library
      const script2 = document.createElement('script');
      script2.src = 'https://accounts.google.com/gsi/client';
      script2.onload = () => {
        this.gisLoaded = true;
        if (this.gapiLoaded && this.gisLoaded) {
          this.initializeTokenClient();
          resolve(true);
        }
      };
      document.body.appendChild(script2);
    });
  }

  /**
   * Load GAPI client and initialize
   */
  private async loadGapiClient(): Promise<void> {
    return new Promise((resolve) => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          // API key is optional when using OAuth
          discoveryDocs: this.googleCalendarConfig.discoveryDocs,
        });
        resolve();
      });
    });
  }

  /**
   * Initialize Google Identity Services token client
   */
  private initializeTokenClient(): void {
    // Safety check to ensure Google Identity Services is loaded
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      console.error('Google Identity Services not fully loaded');
      return;
    }
    
    try {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.googleCalendarConfig.clientId,
        scope: this.googleCalendarConfig.scopes.join(' '),
        callback: (response: any) => {
          if (response.error !== undefined) {
            this.isAuthenticated = false;
            throw new Error(response.error);
          }
          this.isAuthenticated = true;
        },
      });
    } catch (error) {
      console.error('Error initializing token client:', error);
    }
  }

  /**
   * Authenticate with Google
   */
  public async authenticate(): Promise<boolean> {
    if (!this.tokenClient) {
      // Try to initialize again if not already initialized
      if (window.google?.accounts?.oauth2) {
        this.initializeTokenClient();
      }
      
      if (!this.tokenClient) {
        throw new Error('Token client not initialized. Please refresh the page and try again.');
      }
    }
    
    return new Promise((resolve) => {
      try {
        this.tokenClient.callback = (response: any) => {
          if (response.error !== undefined) {
            this.isAuthenticated = false;
            resolve(false);
            return;
          }
          
          this.isAuthenticated = true;
          resolve(true);
        };
        
        if (window.gapi.client.getToken() === null) {
          // Request an access token
          this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          // Skip consent prompt if already have token
          this.tokenClient.requestAccessToken({ prompt: '' });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        resolve(false);
      }
    });
  }

  /**
   * Sign out from Google
   */
  signOut(): void {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken(null);
      this.isAuthenticated = false;
    }
  }

  /**
   * Check if user is authenticated with Google Calendar
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Create a calendar event
   */
  async createEvent(event: CalendarEvent): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated with Google Calendar');
    }

    const googleEvent = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: event.location,
      attendees: event.attendees?.map(email => ({ email })),
      conferenceData: event.videoConferenceLink ? {
        createRequest: {
          requestId: `jobmate-${Date.now()}`
        }
      } : undefined
    };

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: googleEvent,
        conferenceDataVersion: event.videoConferenceLink ? 1 : 0
      });
      
      return response.result.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Get user's calendar events within a date range
   */
  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated with Google Calendar');
    }

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items.map((item: any) => ({
        id: item.id,
        title: item.summary,
        description: item.description,
        startTime: new Date(item.start.dateTime || item.start.date),
        endTime: new Date(item.end.dateTime || item.end.date),
        location: item.location,
        attendees: item.attendees?.map((attendee: any) => attendee.email),
        videoConferenceLink: item.hangoutLink || item.conferenceData?.entryPoints?.[0]?.uri
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Convert JobMate availability settings to calendar events
   */
  convertAvailabilityToEvents(
    availability: AvailabilitySettings, 
    title: string, 
    description: string
  ): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    
    // Process each available day
    availability.availableDays.forEach(day => {
      day.timeSlots.forEach(slotId => {
        // Find the time slot details
        const timeSlot = TIME_SLOTS.find(slot => slot.id === slotId);
        if (!timeSlot) return;
        
        // Create start and end times
        const [startHour, startMinute] = timeSlot.startTime.split(':').map(Number);
        const [endHour, endMinute] = timeSlot.endTime.split(':').map(Number);
        
        const startTime = new Date(day.date);
        startTime.setHours(startHour, startMinute, 0);
        
        const endTime = new Date(day.date);
        endTime.setHours(endHour, endMinute, 0);
        
        // Handle overnight slots
        if (endTime < startTime) {
          endTime.setDate(endTime.getDate() + 1);
        }
        
        events.push({
          title,
          description,
          startTime,
          endTime
        });
      });
    });
    
    return events;
  }

  /**
   * Check for scheduling conflicts
   */
  async checkForConflicts(proposedEvents: CalendarEvent[]): Promise<CalendarEvent[]> {
    if (proposedEvents.length === 0) return [];
    
    // Find the earliest and latest dates in proposed events
    const startDates = proposedEvents.map(e => e.startTime);
    const endDates = proposedEvents.map(e => e.endTime);
    
    const earliestDate = new Date(Math.min(...startDates.map(d => d.getTime())));
    const latestDate = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    // Get existing events in this time range
    const existingEvents = await this.getEvents(earliestDate, latestDate);
    
    // Find conflicts
    return proposedEvents.filter(proposed => {
      return existingEvents.some(existing => {
        // Check for overlap
        return (
          (proposed.startTime < existing.endTime && proposed.endTime > existing.startTime) ||
          (existing.startTime < proposed.endTime && existing.endTime > proposed.startTime)
        );
      });
    });
  }

  /**
   * Find available meeting times between two users
   */
  async findMeetingTimes(
    userAvailability: AvailabilitySettings,
    otherUserAvailability: AvailabilitySettings,
    durationMinutes: number = 60
  ): Promise<CalendarEvent[]> {
    const potentialSlots: CalendarEvent[] = [];
    
    // Find days that both users have availability
    userAvailability.availableDays.forEach(userDay => {
      const matchingOtherDay = otherUserAvailability.availableDays.find(
        otherDay => isSameDay(new Date(userDay.date), new Date(otherDay.date))
      );
      
      if (matchingOtherDay) {
        // Find common time slots
        const commonSlots = userDay.timeSlots.filter(
          slot => matchingOtherDay.timeSlots.includes(slot)
        );
        
        // Create potential meeting slots
        commonSlots.forEach(slotId => {
          const timeSlot = TIME_SLOTS.find(slot => slot.id === slotId);
          if (!timeSlot) return;
          
          const [startHour, startMinute] = timeSlot.startTime.split(':').map(Number);
          const [endHour, endMinute] = timeSlot.endTime.split(':').map(Number);
          
          const startTime = new Date(userDay.date);
          startTime.setHours(startHour, startMinute, 0);
          
          const endTime = new Date(userDay.date);
          endTime.setHours(endHour, endMinute, 0);
          
          // Handle overnight slots
          if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
          }
          
          // Create 30-minute intervals within this time slot
          const slotDurationMs = endTime.getTime() - startTime.getTime();
          const meetingDurationMs = durationMinutes * 60 * 1000;
          
          if (slotDurationMs >= meetingDurationMs) {
            let currentStart = new Date(startTime);
            
            while (currentStart.getTime() + meetingDurationMs <= endTime.getTime()) {
              const currentEnd = new Date(currentStart.getTime() + meetingDurationMs);
              
              potentialSlots.push({
                title: 'Potential Meeting',
                startTime: new Date(currentStart),
                endTime: new Date(currentEnd)
              });
              
              // Move to next 30-minute interval
              currentStart = new Date(currentStart.getTime() + 30 * 60 * 1000);
            }
          }
        });
      }
    });
    
    // Check for conflicts with existing calendar events
    const availableSlots = potentialSlots.filter(
      async slot => !(await this.checkForConflicts([slot])).length
    );
    
    return availableSlots;
  }
}

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

// Export singleton instance
export const calendarService = new CalendarService();
