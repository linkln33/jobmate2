import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedPreferenceComponent from '@/components/jobmates/enhanced-preference-component';

// Mock the preference service
jest.mock('@/services/preference-service', () => ({
  preferenceService: {
    savePreferences: jest.fn().mockResolvedValue({ success: true })
  }
}));

// Mock the shared components
jest.mock('@/components/shared/availability-calendar', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onChange }) => (
    <div data-testid="mock-availability-calendar">
      <button onClick={() => onChange({ weekdays: true, weekends: false })}>
        Set Availability
      </button>
    </div>
  ))
}));

jest.mock('@/components/shared/skill-selector', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onChange }) => (
    <div data-testid="mock-skill-selector">
      <button onClick={() => onChange(['coding', 'design'])}>
        Select Skills
      </button>
    </div>
  ))
}));

jest.mock('@/components/shared/service-type-selector', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onChange }) => (
    <div data-testid="mock-service-type-selector">
      <button onClick={() => onChange(['remote'])}>
        Toggle Service Type
      </button>
    </div>
  ))
}));

// Mock the data modules
jest.mock('@/data/category-features', () => ({
  getFeaturesForCategory: jest.fn().mockImplementation((intentId, categoryId) => ({
    showSkillSelector: true,
    showServiceTypeSelector: true,
    showLocationSelector: true,
    showPriceRange: true,
    showExperienceLevel: true,
    showRatingFilter: true,
    showPaymentMethods: true,
    showSpecialRequirements: true,
    showAvailabilityCalendar: true,
    showUrgencySelector: true,
    showIndustrySelector: intentId === 'hire-someone'
  }))
}));

jest.mock('@/data/suggested-skills', () => ({
  getSkillsForCategory: jest.fn().mockReturnValue([
    { id: 'coding', name: 'Coding' },
    { id: 'design', name: 'Design' }
  ]),
  getIndustriesForCategory: jest.fn().mockReturnValue([
    { id: 'tech', name: 'Technology' },
    { id: 'health', name: 'Healthcare' }
  ])
}));

jest.mock('@/data/service-types', () => ({
  getServiceTypesForCategory: jest.fn().mockReturnValue([
    { id: 'remote', name: 'Remote' },
    { id: 'onsite', name: 'On-site' }
  ])
}));

describe('EnhancedPreferenceComponent', () => {
  const mockOnBack = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly for hire-someone intent and cleaning category', () => {
    render(
      <EnhancedPreferenceComponent 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );
    
    // Verify title and description are rendered
    expect(screen.getByText('Customize Your Preferences')).toBeInTheDocument();
    expect(screen.getByText('Tailor your experience to find the perfect match')).toBeInTheDocument();
    
    // Verify mocked components are rendered
    expect(screen.getByTestId('mock-skill-selector')).toBeInTheDocument();
    expect(screen.getByTestId('mock-service-type-selector')).toBeInTheDocument();
    expect(screen.getByTestId('mock-availability-calendar')).toBeInTheDocument();
    
    // Verify buttons are rendered
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save & continue/i })).toBeInTheDocument();
  });

  test('handles loading state correctly', () => {
    render(
      <EnhancedPreferenceComponent 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onComplete={mockOnComplete}
        isLoading={true}
      />
    );
    
    // Verify loading state disables the save button
    const saveButton = screen.getByRole('button', { name: /save & continue/i });
    expect(saveButton).toBeDisabled();
  });

  test('calls onBack when back button is clicked', () => {
    render(
      <EnhancedPreferenceComponent 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );
    
    // Find and click the back button
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    // Check that onBack was called
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('calls onComplete with preferences when form is submitted', async () => {
    render(
      <EnhancedPreferenceComponent 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );
    
    // Fill out the form
    // Set location
    const locationInput = screen.getByLabelText(/location/i);
    fireEvent.change(locationInput, { target: { value: 'New York' } });
    
    // Set skills via mocked component
    const selectSkillsButton = screen.getByText('Select Skills');
    fireEvent.click(selectSkillsButton);
    
    // Set service type via mocked component
    const toggleServiceTypeButton = screen.getByText('Toggle Service Type');
    fireEvent.click(toggleServiceTypeButton);
    
    // Set availability via mocked component
    const setAvailabilityButton = screen.getByText('Set Availability');
    fireEvent.click(setAvailabilityButton);
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save & continue/i });
    fireEvent.click(saveButton);
    
    // Check that onComplete was called with the expected preferences
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
      expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
        location: 'New York',
        skills: ['coding', 'design'],
        serviceTypes: ['remote'],
        availability: { weekdays: true, weekends: false }
      }));
    });
  });

  test('loads existing preferences correctly', () => {
    const existingPreferences = {
      location: 'Chicago',
      locationRadius: 20,
      skills: ['marketing'],
      serviceTypes: ['onsite'],
      priceRange: [50, 150],
      experienceLevel: 'expert',
      minRating: 5,
      specialRequirements: 'Must have certification',
      availability: { weekdays: true, weekends: true },
      urgency: 'high'
    };
    
    render(
      <EnhancedPreferenceComponent 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onComplete={mockOnComplete}
        preferences={existingPreferences}
      />
    );
    
    // Check that existing preferences are loaded
    const locationInput = screen.getByLabelText(/location/i);
    expect(locationInput).toHaveValue('Chicago');
    
    const specialRequirementsInput = screen.getByLabelText(/special requirements/i);
    expect(specialRequirementsInput).toHaveValue('Must have certification');
  });
});
