# Map View

## Overview

The Map View is an interactive, location-based interface that allows specialists to browse available jobs geographically. Using Google Maps integration, specialists can see job markers on a map, filter jobs by various criteria, and interact with job details directly from the map interface.

## Key Features

- **Interactive Job Markers** - Visual representation of jobs on the map
- **Animated Markers** - Pulsing animation for urgent jobs to draw attention
- **Job Filtering** - Filter jobs by category, price range, and other criteria
- **Info Windows** - Click markers to see job details without leaving the map
- **User Location** - Center map on specialist's current location
- **Mobile Responsive** - Fully functional on both desktop and mobile devices

## Marker Types and Animations

The Map View uses different marker styles to convey job information at a glance:

| Marker Type | Visual Style | Meaning |
|-------------|--------------|---------|
| Standard | Blue circle | Regular job posting |
| Selected | Larger marker with black border | Currently selected job |
| Urgent | Red pulsing circle | Time-sensitive job requiring quick response |
| Completed | Green circle | Job that has been completed |
| In Progress | Yellow circle | Job currently being worked on |
| Cancelled | Red circle | Job that has been cancelled |

## Animated Markers

Urgent jobs feature a pulsing animation to draw attention:

- **Pulsing Effect** - Expanding and contracting ring animation
- **Color Coding** - Red color indicates urgency
- **Selection Behavior** - Animation changes to bounce when selected

## Map Controls

The Map View includes several user controls:

- **Zoom Controls** - Zoom in/out of the map
- **Center on Jobs** - Button to fit all visible jobs in the viewport
- **Center on User** - Button to center the map on the specialist's location
- **Filter Panel** - Expandable panel for filtering jobs by various criteria

## Job Info Windows

Clicking on a job marker opens an info window with:

- Job title and category
- Brief description
- Budget information
- Urgency and verification badges
- Quick action buttons (view details, get directions)

## Technical Implementation

The Map View is implemented using:

1. **Google Maps API** - For the map interface and marker functionality
2. **EnhancedJobMap Component** - React component that manages the map display
3. **Custom Overlays** - For animated markers and custom UI elements
4. **Responsive Design** - Adapts to different screen sizes and devices

## Map Filtering

Specialists can filter jobs on the map by:

- **Job Category** - Filter by service type (plumbing, electrical, etc.)
- **Price Range** - Set minimum and maximum budget
- **Distance** - Filter by distance from specialist's location
- **Urgency** - Show only urgent jobs
- **Verification** - Show only jobs with verified payment
- **Special Filters** - Neighbor-posted jobs, premium jobs, etc.

## Integration Points

The Map View integrates with several other platform components:

- **Job Listing** - Synchronized selection between list and map views
- **Match System** - Displays match quality indicators on markers
- **Location Services** - Uses specialist's location for proximity features
- **Job Details** - Links to full job details from info windows

## Performance Considerations

The Map View is optimized for performance through:

- **Marker Clustering** - Groups markers in dense areas to improve performance
- **Lazy Loading** - Loads job details only when needed
- **Viewport Limiting** - Limits the number of visible markers based on zoom level
- **Optimized Animations** - Efficient CSS animations for marker effects
