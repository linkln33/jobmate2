// Define the Job interface to be used across the application
export interface Job {
  id: string | number;
  title: string;
  status: string;
  urgency: string;
  address: string;
  price: string;
  time: string;
  scheduledTime?: string;
  customer: string;
  lat: number;
  lng: number;
  category?: string; // Category ID
  subcategory?: string; // Subcategory ID
  icon?: string; // Custom icon for the job
  compatibilityScore?: number; // Compatibility score between 0 and 1
  compatibilityReason?: string; // Reason for the compatibility score
}
