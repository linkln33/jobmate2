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
}
