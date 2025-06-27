import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ListingCreationWizard } from '@/components/marketplace/create-listing/listing-creation-wizard';
import '@testing-library/jest-dom';
import { marketplaceService } from '@/services/marketplaceService';

// Mock the marketplace service
jest.mock('@/services/marketplaceService', () => ({
  marketplaceService: {
    createListing: jest.fn().mockResolvedValue({ id: 'test-listing-id' }),
    getCategories: jest.fn().mockResolvedValue([
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Furniture' }
    ])
  }
}));

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn()
  })
}));

describe('ListingCreationWizard', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the first step of the wizard', () => {
    render(<ListingCreationWizard onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    // Check that the first step is rendered
    expect(screen.getByText(/create your listing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<ListingCreationWizard onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    // Find and click the cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    // Check that onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('navigates through wizard steps', async () => {
    render(<ListingCreationWizard onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    // Step 1: Fill out basic info
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Listing' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a test listing' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '99.99' } });
    
    // Click next button
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Wait for step 2 to appear
    await waitFor(() => {
      expect(screen.getByText(/additional details/i)).toBeInTheDocument();
    });
    
    // Click next button for step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Wait for step 3 to appear
    await waitFor(() => {
      expect(screen.getByText(/location/i)).toBeInTheDocument();
    });
    
    // Click next button for step 3
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Wait for step 4 to appear
    await waitFor(() => {
      expect(screen.getByText(/media/i)).toBeInTheDocument();
    });
    
    // Click next button for step 4
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Wait for review step to appear
    await waitFor(() => {
      expect(screen.getByText(/review/i)).toBeInTheDocument();
    });
  });

  test('calls onSuccess when form is submitted successfully', async () => {
    render(<ListingCreationWizard onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    // Step 1: Fill out basic info
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Listing' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a test listing' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '99.99' } });
    
    // Navigate through all steps
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next|submit/i })).toBeInTheDocument();
      });
    }
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(marketplaceService.createListing).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
