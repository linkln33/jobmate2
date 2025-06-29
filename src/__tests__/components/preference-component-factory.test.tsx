import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreferenceComponentFactory from '@/components/jobmates/preference-component-factory';

// Mock the enhanced preference component
jest.mock('@/components/jobmates/enhanced-preference-component', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ intentId, categoryId }) => (
    <div data-testid="mock-enhanced-preference-component">
      Enhanced Preference Component for {intentId} - {categoryId}
    </div>
  ))
}));

// Mock the data modules
jest.mock('@/data/category-features', () => ({
  getFeaturesForCategory: jest.fn().mockImplementation(() => ({
    showSkillSelector: true,
    showServiceTypeSelector: true,
    showLocationSelector: true
  }))
}));

jest.mock('@/types/intent', () => ({
  getIntentById: jest.fn().mockImplementation(id => ({
    id,
    name: id === 'hire-someone' ? 'Hire Someone' : 'Earn Money',
    description: 'Mock intent description'
  }))
}));

jest.mock('@/data/category-mapping', () => ({
  getCategoryById: jest.fn().mockImplementation((intentId, categoryId) => ({
    id: categoryId,
    name: categoryId === 'cleaning' ? 'Cleaning' : 'Gardening',
    description: 'Mock category description'
  }))
}));

describe('PreferenceComponentFactory', () => {
  const mockOnBack = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the enhanced preference component for hire-someone intent and cleaning category', () => {
    render(
      <PreferenceComponentFactory 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onNext={mockOnNext}
        onComplete={mockOnComplete}
      />
    );
    
    // Verify the enhanced preference component is rendered
    expect(screen.getByTestId('mock-enhanced-preference-component')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Preference Component for hire-someone - cleaning')).toBeInTheDocument();
    
    // Verify the intent and category names are displayed
    expect(screen.getByText('Hire Someone - Cleaning Preferences')).toBeInTheDocument();
  });

  test('renders the enhanced preference component for earn-money intent and freelance category', () => {
    render(
      <PreferenceComponentFactory 
        intentId="earn-money"
        categoryId="freelance"
        onBack={mockOnBack}
        onNext={mockOnNext}
        onComplete={mockOnComplete}
      />
    );
    
    // Verify the enhanced preference component is rendered
    expect(screen.getByTestId('mock-enhanced-preference-component')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Preference Component for earn-money - freelance')).toBeInTheDocument();
    
    // Verify the intent and category names are displayed
    expect(screen.getByText('Earn Money - Gardening Preferences')).toBeInTheDocument();
  });

  test('passes preferences and loading state to the enhanced preference component', () => {
    const mockPreferences = {
      location: 'New York',
      budget: 100
    };
    
    render(
      <PreferenceComponentFactory 
        intentId="hire-someone"
        categoryId="cleaning"
        onBack={mockOnBack}
        onNext={mockOnNext}
        onComplete={mockOnComplete}
        preferences={mockPreferences}
        isLoading={true}
      />
    );
    
    // Verify the enhanced preference component is rendered with the correct props
    const enhancedPreferenceComponent = require('@/components/jobmates/enhanced-preference-component').default;
    expect(enhancedPreferenceComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        intentId: 'hire-someone',
        categoryId: 'cleaning',
        preferences: mockPreferences,
        isLoading: true
      }),
      expect.anything()
    );
  });

  test('handles missing intent or category gracefully', () => {
    // Mock the intent and category functions to return null
    require('@/types/intent').getIntentById.mockReturnValueOnce(null);
    require('@/data/category-mapping').getCategoryById.mockReturnValueOnce(null);
    
    render(
      <PreferenceComponentFactory 
        intentId="unknown-intent"
        categoryId="unknown-category"
        onBack={mockOnBack}
        onNext={mockOnNext}
        onComplete={mockOnComplete}
      />
    );
    
    // Verify it still renders with the raw IDs
    expect(screen.getByText('unknown-intent - unknown-category Preferences')).toBeInTheDocument();
  });
});
