import { test, expect } from '@playwright/test';

test.describe('Marketplace Listing Creation Wizard', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login credentials (using test account)
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // Submit the login form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to complete and dashboard to load
    await page.waitForURL('/dashboard');
    
    // Navigate to profile page
    await page.goto('/profile');
    
    // Click on the Marketplace tab
    await page.getByRole('tab', { name: /marketplace/i }).click();
  });

  test('should open listing wizard from profile page', async ({ page }) => {
    // Click on the "Create New Listing" button
    await page.getByRole('button', { name: /create new listing/i }).click();
    
    // Verify the listing wizard dialog is visible
    await expect(page.locator('dialog')).toBeVisible();
    
    // Verify the first step of the wizard is displayed
    await expect(page.getByText(/create your listing/i)).toBeVisible();
    
    // Close the wizard by clicking the cancel button
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Verify the dialog is closed
    await expect(page.locator('dialog')).not.toBeVisible();
  });

  test('should navigate through wizard steps', async ({ page }) => {
    // Open the listing wizard
    await page.getByRole('button', { name: /create new listing/i }).click();
    
    // Step 1: Basic Info
    await page.getByLabel('Title').fill('Test Listing');
    await page.getByLabel('Description').fill('This is a test listing created by automated tests');
    await page.getByLabel('Category').selectOption('Electronics');
    await page.getByLabel('Price').fill('99.99');
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 2: Details
    await page.getByLabel('Condition').selectOption('New');
    await page.getByLabel('Brand').fill('Test Brand');
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 3: Location
    await page.getByLabel('Address').fill('123 Test Street');
    await page.getByLabel('City').fill('Test City');
    await page.getByLabel('State').fill('Test State');
    await page.getByLabel('Zip Code').fill('12345');
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 4: Media (skip file upload in test)
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 5: Review & Submit
    await expect(page.getByText(/review your listing/i)).toBeVisible();
    
    // Verify listing details are displayed in review step
    await expect(page.getByText('Test Listing')).toBeVisible();
    await expect(page.getByText('99.99')).toBeVisible();
    
    // Cancel instead of submitting to avoid creating test data
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Verify the dialog is closed
    await expect(page.locator('dialog')).not.toBeVisible();
  });

  test('should show success notification after listing creation', async ({ page }) => {
    // This test will mock the submission to verify the success notification
    
    // Open the listing wizard
    await page.getByRole('button', { name: /create new listing/i }).click();
    
    // Fill in minimal required fields for each step
    // Step 1: Basic Info
    await page.getByLabel('Title').fill('Quick Test Listing');
    await page.getByLabel('Description').fill('This is a quick test');
    await page.getByLabel('Category').selectOption('Electronics');
    await page.getByLabel('Price').fill('50');
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 2: Details (minimal)
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 3: Location (minimal)
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 4: Media (skip)
    await page.getByRole('button', { name: /next/i }).click();
    
    // Step 5: Review & Submit
    
    // Mock the API response for listing creation
    await page.route('**/api/marketplace/listings', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 'test-listing-id' })
      });
    });
    
    // Submit the form
    await page.getByRole('button', { name: /submit/i }).click();
    
    // Verify success notification appears
    await expect(page.getByText(/listing created successfully/i)).toBeVisible();
    
    // Verify we're back on the profile page
    await expect(page.url()).toContain('/profile');
  });
});
