// Service type interface for the service type selector component
export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}

// Service type category interface
export interface ServiceTypeCategory {
  id: string;
  name: string;
  serviceTypes: ServiceType[];
}
