# Archived Components

This directory contains components, pages, and contexts that were previously used in the JobMate application but have been superseded by newer implementations.

## Directory Structure

- `/components/pages`: Outdated page components
- `/components/ui`: Outdated UI components
- `/contexts`: Outdated context providers
- `/app`: Test pages and outdated app router pages

## Archived Components

### Homepage Components

- `unified-home-page.tsx`: Original unified homepage implementation
- `unified-home-page-new.tsx`: Intermediate version of the homepage
- `home-page.tsx`: Legacy homepage component
- `unified-home-page-sections.tsx`: Original sections that were later split into individual components

These components have been replaced by the modular homepage implementation in `unified-home-page-final.tsx` which uses individual section components from the `/components/sections/` directory.

### UI Components

- `animated-ai-assistant.tsx`: Original AI assistant animation, replaced by `ai-robot-face.tsx` which provides a more robot-like appearance

### Test Pages

- `auth-test/page.tsx`: Authentication testing page
- `signup-test/page.tsx`: Signup flow testing page

## Current Implementation

The current homepage implementation uses:

1. `unified-home-page-final.tsx` as the main container
2. Individual section components from `/components/sections/`
3. `sticky-navbar.tsx` for the navigation
4. `ai-robot-face.tsx` for the AI assistant visualization
5. Real user avatars in the "Trusted by" section

## Archive Date

These components were archived on June 21, 2025 as part of the homepage redesign project.
