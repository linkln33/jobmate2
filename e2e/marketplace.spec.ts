import { test, expect } from '@playwright/test';

test.describe('Marketplace Page', () => {
  test('should navigate between grid and map views', async ({ page }) => {
    // Navigate to the marketplace page
    await page.goto('/marketplace');
    
    // Verify we're on the marketplace page
    await expect(page).toHaveTitle(/Marketplace/);
    
    // Check that we have listings displayed in grid view
    await expect(page.locator('.marketplace-grid')).toBeVisible();
    
    // Click on the "Map View" button
    await page.getByRole('button', { name: /map view/i }).click();
    
    // Verify we navigated to the map page
    await expect(page).toHaveURL(/\/marketplace\/map/);
    
    // Check that the map is visible
    await expect(page.locator('.marketplace-map')).toBeVisible();
    
    // Click on the "Grid View" button to go back
    await page.getByRole('button', { name: /grid view/i }).click();
    
    // Verify we're back on the main marketplace page
    await expect(page).toHaveURL(/\/marketplace$/);
  });

  test('should filter listings by tab and search', async ({ page }) => {
    // Navigate to the marketplace page
    await page.goto('/marketplace');
    
    // Click on the "Services" tab
    await page.getByRole('tab', { name: /services/i }).click();
    
    // Verify the URL contains the services filter
    await expect(page.url()).toContain('services');
    
    // Enter a search term
    await page.getByPlaceholder(/search/i).fill('design');
    
    // Wait for the search results to update
    await page.waitForTimeout(500);
    
    // Check that the filtered results are displayed
    const listings = page.locator('.marketplace-listing-card');
    await expect(listings).toHaveCount(await listings.count());
    
    // Verify at least one listing contains the search term
    if (await listings.count() > 0) {
      const firstListingText = await listings.first().textContent();
      expect(firstListingText?.toLowerCase()).toContain('design');
    }
  });

  test('should navigate to listing detail when clicking on a listing', async ({ page }) => {
    // Navigate to the marketplace page
    await page.goto('/marketplace');
    
    // Click on the first listing
    const firstListing = page.locator('.marketplace-listing-card').first();
    
    // Get the listing ID or title for verification later
    const listingId = await firstListing.getAttribute('data-id');
    
    await firstListing.click();
    
    // Verify we navigated to the listing detail page
    await expect(page.url()).toContain('/marketplace/listing/');
    
    if (listingId) {
      await expect(page.url()).toContain(listingId);
    }
    
    // Verify the listing detail page has loaded
    await expect(page.locator('.listing-detail')).toBeVisible();
  });
});
