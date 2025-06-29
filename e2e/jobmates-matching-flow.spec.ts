import { test, expect } from '@playwright/test';

test.describe('Jobmates Matching Flow', () => {
  test('complete user journey from intent to results', async ({ page }) => {
    // Start at the jobmates page
    await page.goto('/jobmates');
    
    // Step 1: Select intent
    await page.getByText('Hire Someone').click();
    
    // Verify we moved to the category selection step
    await expect(page.getByText('What type of service are you looking for?')).toBeVisible();
    
    // Step 2: Select category
    await page.getByText('Cleaning').click();
    
    // Verify we moved to the preference customization step
    await expect(page.getByText('Customize Your Preferences')).toBeVisible();
    
    // Step 3: Fill out preferences
    // Set location
    await page.getByLabel('Location').fill('New York');
    
    // Set price range (if slider is used)
    // This is a complex interaction that depends on the actual implementation
    // For now, we'll just check if the element exists
    await expect(page.getByText('Price Range')).toBeVisible();
    
    // Select skills (if applicable)
    const skillSelector = page.getByTestId('skill-selector');
    if (await skillSelector.isVisible()) {
      await skillSelector.click();
      await page.getByText('Deep Cleaning').click();
    }
    
    // Set availability (if applicable)
    const availabilitySection = page.getByText('Availability');
    if (await availabilitySection.isVisible()) {
      // Select weekdays
      await page.getByLabel('Weekdays').check();
    }
    
    // Submit preferences
    await page.getByRole('button', { name: 'Save Preferences' }).click();
    
    // Verify we moved to the results step
    await expect(page.getByText('Your preferences have been saved')).toBeVisible();
    
    // Verify the completion button is visible
    await expect(page.getByRole('button', { name: 'View Matches' })).toBeVisible();
    
    // Click to view matches
    await page.getByRole('button', { name: 'View Matches' }).click();
    
    // Verify we are redirected to the matches page
    await expect(page.url()).toContain('/matches');
  });

  test('can navigate back through steps', async ({ page }) => {
    // Start at the jobmates page
    await page.goto('/jobmates');
    
    // Step 1: Select intent
    await page.getByText('Hire Someone').click();
    
    // Step 2: Select category
    await page.getByText('Cleaning').click();
    
    // Verify we're at the preference step
    await expect(page.getByText('Customize Your Preferences')).toBeVisible();
    
    // Go back to category selection
    await page.getByRole('button', { name: 'Back' }).click();
    
    // Verify we're back at category selection
    await expect(page.getByText('What type of service are you looking for?')).toBeVisible();
    
    // Go back to intent selection
    await page.getByRole('button', { name: 'Back' }).click();
    
    // Verify we're back at intent selection
    await expect(page.getByText('What brings you to Jobmates today?')).toBeVisible();
  });

  test('handles loading and error states', async ({ page }) => {
    // Mock API to simulate slow response and then error
    await page.route('**/api/preferences', async (route) => {
      // Delay the response to simulate loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Return an error response
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    // Start at the jobmates page
    await page.goto('/jobmates');
    
    // Complete the flow up to preferences
    await page.getByText('Hire Someone').click();
    await page.getByText('Cleaning').click();
    await page.getByLabel('Location').fill('New York');
    
    // Submit preferences
    await page.getByRole('button', { name: 'Save Preferences' }).click();
    
    // Verify loading state is shown
    await expect(page.getByText('Saving your preferences...')).toBeVisible();
    
    // Verify error state is shown after the request fails
    await expect(page.getByText('There was an error saving your preferences')).toBeVisible();
    
    // Verify retry button is shown
    await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
  });

  test('can start with pre-selected intent and category', async ({ page }) => {
    // Start at the jobmates page with query parameters for intent and category
    await page.goto('/jobmates?intent=hire-someone&category=cleaning');
    
    // Verify we start directly at the preference customization step
    await expect(page.getByText('Customize Your Preferences')).toBeVisible();
    
    // Verify the intent and category are correctly displayed
    await expect(page.getByText('Hire Someone - Cleaning Preferences')).toBeVisible();
  });
});
