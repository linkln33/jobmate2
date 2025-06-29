import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StepController from '@/components/jobmates/step-controller';

// Mock the intent components
jest.mock('@/components/intent/intent-selector', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onSelectIntent }) => (
    <div data-testid="mock-intent-selector">
      <button onClick={() => onSelectIntent('hire-someone')}>Select Hire Someone</button>
      <button onClick={() => onSelectIntent('earn-money')}>Select Earn Money</button>
    </div>
  ))
}));

jest.mock('@/components/intent/hire-someone', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onSelectCategory }) => (
    <div data-testid="mock-hire-someone">
      <button onClick={() => onSelectCategory('cleaning')}>Select Cleaning</button>
      <button onClick={() => onSelectCategory('gardening')}>Select Gardening</button>
    </div>
  ))
}));

jest.mock('@/components/intent/earn-money', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onSelectCategory }) => (
    <div data-testid="mock-earn-money">
      <button onClick={() => onSelectCategory('freelance')}>Select Freelance</button>
    </div>
  ))
}));

// Mock the preference component factory
jest.mock('@/components/jobmates/preference-component-factory', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ intentId, categoryId, onBack, onComplete }) => (
    <div data-testid="mock-preference-component">
      <p>Preferences for {intentId} - {categoryId}</p>
      <button onClick={onBack}>Back</button>
      <button onClick={() => onComplete({ location: 'New York', budget: 100 })}>
        Complete Preferences
      </button>
    </div>
  ))
}));

// Mock the helper functions
jest.mock('@/types/intent', () => ({
  getIntentById: jest.fn().mockImplementation(id => ({
    id,
    name: id === 'hire-someone' ? 'Hire Someone' : 'Earn Money',
    description: 'Mock intent description'
  }))
}));

jest.mock('@/data/category-mapping', () => ({
  getCategoryById: jest.fn().mockImplementation(id => ({
    id,
    name: id === 'cleaning' ? 'Cleaning' : 'Gardening',
    description: 'Mock category description'
  }))
}));

// Mock the matching service
jest.mock('@/services/server/matching-service', () => ({
  matchingService: {
    savePreferences: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('StepController', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the intent selection step initially', () => {
    render(<StepController onComplete={mockOnComplete} />);
    
    // Verify intent selector is rendered
    expect(screen.getByTestId('mock-intent-selector')).toBeInTheDocument();
    
    // Verify stepper shows the first step as active
    expect(screen.getByText('Select Intent')).toBeInTheDocument();
  });

  test('navigates from intent to category selection', () => {
    render(<StepController onComplete={mockOnComplete} />);
    
    // Select an intent
    const hireButton = screen.getByText('Select Hire Someone');
    fireEvent.click(hireButton);
    
    // Verify category selection component is rendered
    expect(screen.getByTestId('mock-hire-someone')).toBeInTheDocument();
    
    // Verify stepper shows the second step as active
    expect(screen.getByText('Select Category')).toBeInTheDocument();
  });

  test('navigates from category to preference customization', () => {
    render(<StepController onComplete={mockOnComplete} />);
    
    // Select an intent
    const hireButton = screen.getByText('Select Hire Someone');
    fireEvent.click(hireButton);
    
    // Select a category
    const cleaningButton = screen.getByText('Select Cleaning');
    fireEvent.click(cleaningButton);
    
    // Verify preference component is rendered
    expect(screen.getByTestId('mock-preference-component')).toBeInTheDocument();
    expect(screen.getByText('Preferences for hire-someone - cleaning')).toBeInTheDocument();
    
    // Verify stepper shows the third step as active
    expect(screen.getByText('Customize Preferences')).toBeInTheDocument();
  });

  test('navigates back from preference customization to category selection', () => {
    render(<StepController onComplete={mockOnComplete} />);
    
    // Navigate to preference customization
    fireEvent.click(screen.getByText('Select Hire Someone'));
    fireEvent.click(screen.getByText('Select Cleaning'));
    
    // Go back to category selection
    fireEvent.click(screen.getByText('Back'));
    
    // Verify category selection is rendered again
    expect(screen.getByTestId('mock-hire-someone')).toBeInTheDocument();
  });

  test('completes the flow and calls onComplete', async () => {
    render(<StepController onComplete={mockOnComplete} />);
    
    // Navigate through the flow
    fireEvent.click(screen.getByText('Select Hire Someone'));
    fireEvent.click(screen.getByText('Select Cleaning'));
    
    // Complete preferences
    fireEvent.click(screen.getByText('Complete Preferences'));
    
    // Wait for the results step
    await waitFor(() => {
      // Verify success message is shown
      expect(screen.getByText(/your preferences have been saved/i)).toBeInTheDocument();
      
      // Verify onComplete was called with the expected data
      expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
        intentId: 'hire-someone',
        categoryId: 'cleaning',
        preferences: expect.objectContaining({
          location: 'New York',
          budget: 100
        })
      }));
    });
  });

  test('handles loading state during preference saving', async () => {
    // Mock the matching service to delay resolution
    const mockSavePreferences = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 100);
      });
    });
    
    require('@/services/server/matching-service').matchingService.savePreferences = mockSavePreferences;
    
    render(<StepController onComplete={mockOnComplete} />);
    
    // Navigate through the flow
    fireEvent.click(screen.getByText('Select Hire Someone'));
    fireEvent.click(screen.getByText('Select Cleaning'));
    
    // Complete preferences
    fireEvent.click(screen.getByText('Complete Preferences'));
    
    // Verify loading state is shown
    expect(screen.getByText(/saving your preferences/i)).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText(/your preferences have been saved/i)).toBeInTheDocument();
    });
  });

  test('handles error state during preference saving', async () => {
    // Mock the matching service to reject
    const mockSavePreferences = jest.fn().mockRejectedValue(new Error('Failed to save'));
    require('@/services/server/matching-service').matchingService.savePreferences = mockSavePreferences;
    
    render(<StepController onComplete={mockOnComplete} />);
    
    // Navigate through the flow
    fireEvent.click(screen.getByText('Select Hire Someone'));
    fireEvent.click(screen.getByText('Select Cleaning'));
    
    // Complete preferences
    fireEvent.click(screen.getByText('Complete Preferences'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/there was an error saving your preferences/i)).toBeInTheDocument();
      
      // Verify retry button is shown
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });
  });

  test('initializes with provided intent and category', () => {
    render(
      <StepController 
        onComplete={mockOnComplete}
        initialIntentId="hire-someone"
        initialCategoryId="cleaning"
      />
    );
    
    // Verify it starts at the preference customization step
    expect(screen.getByTestId('mock-preference-component')).toBeInTheDocument();
    expect(screen.getByText('Preferences for hire-someone - cleaning')).toBeInTheDocument();
  });
});
