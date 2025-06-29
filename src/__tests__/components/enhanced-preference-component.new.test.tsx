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
  default: jest.fn().mockImplementation(({ availability, onChange }) => (
    <div data-testid="mock-availability-calendar">
      <button onClick={() => onChange({ weekdays: true, weekends: false })}>
        Set Availability
      </button>
    </div>
  ))
}));

jest.mock('@/components/shared/skill-selector', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ selectedSkills, onChange }) => (
    <div data-testid="mock-skill-selector">
      <button onClick={() => onChange(['coding', 'design'])}>
        Select Skills
      </button>
    </div>
  ))
}));

jest.mock('@/components/shared/service-type-selector', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ selectedServiceTypes, onChange }) => (
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

  test('renders correctly with basic props', () => {
    render(
      <EnhancedPreferenceComponent 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );
    
    // Verify title is rendered
    expect(screen.getByText('Customize Your Preferences')).toBeInTheDocument();
  });
});
