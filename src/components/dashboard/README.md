# Dashboard Components

This directory contains components used in the JobMate dashboard interfaces. These components provide users with insights, analytics, and interactive elements to manage their JobMate experience.

## Overview

Dashboard components serve several key purposes:

1. **Data visualization** - Display user metrics and activity in an understandable format
2. **Quick actions** - Provide shortcuts to common tasks and functions
3. **Status overview** - Show current state of jobs, applications, and matches
4. **Personalized recommendations** - Display tailored suggestions based on user data

## Available Components

### Main Dashboard Views

- `customer-dashboard.tsx` - Primary dashboard view for customers/clients
- `specialist-dashboard.tsx` - Primary dashboard view for service providers/specialists

### Dashboard Widgets

- `compatibility-recommendations.tsx` - Shows recommended matches based on compatibility scores
- `top-matches-widget.tsx` - Displays the highest-rated matches for jobs or specialists
- `interactive-map.tsx` - Geographic visualization of nearby jobs or specialists

## Usage Examples

### Main Dashboard Implementation

```tsx
import { CustomerDashboard } from '@/components/dashboard/customer-dashboard';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <h1>Welcome Back, {user.name}</h1>
      <CustomerDashboard userId={user.id} />
    </div>
  );
}
```

### Dashboard Widget Usage

```tsx
import { TopMatchesWidget } from '@/components/dashboard/top-matches-widget';
import { CompatibilityRecommendations } from '@/components/dashboard/compatibility-recommendations';

function DashboardContent() {
  return (
    <div className="dashboard-grid">
      <div className="col-span-2">
        <TopMatchesWidget limit={5} />
      </div>
      <div className="col-span-1">
        <CompatibilityRecommendations userId={user.id} />
      </div>
    </div>
  );
}
```

### Interactive Map Integration

```tsx
import { InteractiveMap } from '@/components/dashboard/interactive-map';

function LocationBasedDashboard() {
  return (
    <div className="location-dashboard">
      <h2>Jobs Near You</h2>
      <InteractiveMap 
        userLocation={userLocation}
        radius={10} // km
        itemType="jobs"
      />
    </div>
  );
}
```

## Component Structure

Dashboard components typically follow this structure:

```tsx
export function DashboardComponent({ 
  userId,
  limit = 5,
  showFilters = true
}: DashboardComponentProps) {
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData[]>([]);
  
  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from API
        const response = await fetchDashboardData(userId, limit);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, limit]);
  
  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  // Empty state
  if (data.length === 0) {
    return <EmptyDashboardState />;
  }
  
  return (
    <div className="dashboard-component">
      {showFilters && <DashboardFilters onFilterChange={handleFilterChange} />}
      
      <div className="dashboard-content">
        {data.map((item) => (
          <DashboardItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

## Data Integration

Dashboard components typically integrate with:

- **API endpoints** - Fetch user-specific data and metrics
- **Real-time updates** - Subscribe to updates for live data
- **Local storage** - Cache dashboard preferences and state
- **Context providers** - Access user context and authentication state

## Customization

Many dashboard components support customization through props:

- **Filtering** - Control what data is displayed
- **Sorting** - Change the order of displayed items
- **Theming** - Adjust visual appearance
- **Layout** - Modify the arrangement of elements
- **Time ranges** - Show data from different time periods

## Responsive Design

Dashboard components are designed to be responsive:

- **Grid layouts** - Adjust columns based on screen size
- **Collapsible sections** - Expand/collapse on smaller screens
- **Priority content** - Show most important content first on mobile
- **Touch-friendly** - Support touch interactions for mobile users

## Performance Considerations

Dashboard components implement performance optimizations:

- **Pagination** - Load data in chunks to improve initial load time
- **Virtualization** - Only render visible items for large lists
- **Memoization** - Prevent unnecessary re-renders
- **Lazy loading** - Defer loading of non-critical components
- **Data caching** - Minimize redundant API calls
