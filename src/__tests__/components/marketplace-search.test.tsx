import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MARKETPLACE_CATEGORIES } from '@/data/marketplace-categories';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveValue(value: string): R;
      toHaveClass(className: string): R;
    }
  }
}

describe('MarketplaceSearch', () => {
  const mockOnSearch = jest.fn();
  const mockOnCategorySelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search input', () => {
    render(<MarketplaceSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search listings or select a category/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('calls onSearch when input changes', () => {
    render(<MarketplaceSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search listings or select a category/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('clears the input when clear button is clicked', () => {
    render(<MarketplaceSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search listings or select a category/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Find and click the clear button
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(searchInput).toHaveValue('');
  });
  
  it('shows category dropdown when input is focused', async () => {
    render(<MarketplaceSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search listings or select a category/i);
    fireEvent.focus(searchInput);
    
    // Check if the Categories header is visible
    const categoriesHeader = await screen.findByText('Categories');
    expect(categoriesHeader).toBeInTheDocument();
    
    // Check if at least the first category is visible
    const firstCategory = MARKETPLACE_CATEGORIES[0];
    const categoryButton = await screen.findByText(firstCategory.name);
    expect(categoryButton).toBeInTheDocument();
  });
  
  it('calls onCategorySelect when a category is clicked', async () => {
    render(
      <MarketplaceSearch 
        onSearch={mockOnSearch} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/search listings or select a category/i);
    fireEvent.focus(searchInput);
    
    // Find and click the first category
    const firstCategory = MARKETPLACE_CATEGORIES[0];
    const categoryButton = await screen.findByText(firstCategory.name);
    fireEvent.click(categoryButton);
    
    expect(mockOnCategorySelect).toHaveBeenCalledWith(firstCategory.id);
  });
  
  it('highlights selected categories', async () => {
    const selectedCategories = [MARKETPLACE_CATEGORIES[0].id];
    
    render(
      <MarketplaceSearch 
        onSearch={mockOnSearch} 
        onCategorySelect={mockOnCategorySelect}
        selectedCategories={selectedCategories}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/search listings or select a category/i);
    fireEvent.focus(searchInput);
    
    // Find the first category button which should be highlighted
    const firstCategory = MARKETPLACE_CATEGORIES[0];
    const categoryButton = await screen.findByText(firstCategory.name);
    
    // Check if it has the blue background class for selected items
    expect(categoryButton.parentElement).toHaveClass('bg-blue-100');
  });
});
