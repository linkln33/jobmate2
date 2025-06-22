# JobMate Migration Plan

This document outlines the plan to migrate from old components to unified components.

## Components Already Migrated

- **Home Page**: Using `UnifiedHomePageFinal` instead of `HomePage`
- **Dashboard Page**: Using `UnifiedDashboardPage` instead of `DashboardPage`
- **Marketplace Page**: Using `UnifiedMarketplacePage` instead of `MarketplacePage`
- **Jobs Page**: Using `UnifiedJobsPage` instead of `JobsPage`
- **Map View Page**: Using `UnifiedMapViewPage` instead of `MapViewPage`
- **Profile Page**: Using `UnifiedProfilePage` instead of `ProfilePage`

## Components Still Needing Migration

The following components still use the old `MainLayout` and need to be migrated to use `UnifiedDashboardLayout`:

1. Login Page -> Create UnifiedLoginPage
2. Signup Page -> Create UnifiedSignupPage
3. Job Post Page -> Create UnifiedJobPostPage
4. Create Job Page -> Create UnifiedCreateJobPage
5. Job Details Page -> Create UnifiedJobDetailsPage
6. Messages Page -> Create UnifiedMessagesPage
7. Search Page -> Create UnifiedSearchPage
8. Category Page -> Create UnifiedCategoryPage

## Files to Delete After Migration

Once all pages have been migrated to use the unified components, the following files can be safely deleted:

- `/src/components/layout/main-layout.tsx`
- `/src/components/pages/home-page.tsx`
- `/src/components/pages/dashboard-page.tsx`
- `/src/components/pages/marketplace-page.tsx`
- `/src/components/pages/profile-page.tsx`
- `/src/components/pages/map-view-page.tsx`
- `/src/components/pages/jobs-page.tsx`
- `/src/components/pages/login-page.tsx`
- `/src/components/pages/signup-page.tsx`
- `/src/components/pages/job-post-page.tsx`
- `/src/components/pages/create-job-page.tsx`
- `/src/components/pages/job-details-page.tsx`
- `/src/components/pages/messages-page.tsx`
- `/src/components/pages/search-page.tsx`
- `/src/components/pages/category-page.tsx`

## Migration Steps

1. Create unified versions of all remaining components
2. Update app pages to use the unified components
3. Test all functionality to ensure everything works correctly
4. Delete old components once all references have been updated
