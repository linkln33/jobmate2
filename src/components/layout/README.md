# Layout Components

This directory contains layout components that define the structural framework of JobMate's pages. These components handle the arrangement and organization of content across the application.

## Overview

Layout components provide consistent structure across the application by:

1. **Defining page structure** - Headers, footers, sidebars, and content areas
2. **Managing navigation** - Navigation bars and menus
3. **Maintaining consistency** - Ensuring uniform spacing, alignment, and organization
4. **Adapting to different devices** - Responsive layouts for various screen sizes

## Available Layout Components

### Core Layouts

- `main-layout.tsx` - The primary layout used for public-facing pages
- `client-layout.tsx` - Layout for authenticated client/customer pages
- `unified-dashboard-layout.tsx` - Comprehensive dashboard layout with sidebar navigation

### Navigation Components

- `navbar.tsx` - Main navigation bar for public pages
- `navbar-dashboard.tsx` - Navigation bar specifically for dashboard pages
- `bottom-tabs.tsx` - Mobile navigation tabs that appear at the bottom of the screen
- `glassmorphic-sidebar.tsx` - Sidebar navigation with frosted glass effect
- `glassmorphic-header.tsx` - Header with frosted glass effect

### Other Layout Elements

- `footer.tsx` - Site footer with links, copyright, and additional information

## Usage Examples

### Basic Page Layout

```tsx
import { MainLayout } from '@/components/layout/main-layout';

export default function AboutPage() {
  return (
    <MainLayout>
      <h1>About JobMate</h1>
      <p>Content goes here...</p>
    </MainLayout>
  );
}
```

### Dashboard Layout

```tsx
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';

export default function DashboardPage() {
  return (
    <UnifiedDashboardLayout 
      title="Dashboard" 
      showMap={false}
    >
      <div className="dashboard-content">
        {/* Dashboard content components */}
      </div>
    </UnifiedDashboardLayout>
  );
}
```

### Next.js App Router Integration

With Next.js App Router, layouts can be used in layout files:

```tsx
// app/(main)/layout.tsx
import { MainLayout } from '@/components/layout/main-layout';

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
```

## Layout Component Structure

Most layout components follow this general structure:

```tsx
export function ExampleLayout({ 
  children,
  title,
  showSidebar = true
}: ExampleLayoutProps) {
  // Layout-specific state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar title={title} onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="flex flex-1">
        {/* Sidebar (conditional) */}
        {showSidebar && (
          <Sidebar 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
```

## Responsive Design

All layout components are built with responsive design principles:

- **Mobile-first approach** - Designed for mobile and enhanced for larger screens
- **Breakpoint-based adjustments** - Layout changes at specific screen widths
- **Conditional rendering** - Some elements only appear on certain screen sizes
- **Flexible containers** - Content areas that adapt to available space

Example of responsive handling:

```tsx
<div className="hidden md:block">
  {/* This content only appears on medium screens and larger */}
  <DesktopNavigation />
</div>

<div className="block md:hidden">
  {/* This content only appears on small screens */}
  <MobileNavigation />
</div>
```

## Theme Integration

Layouts integrate with the application's theming system:

- Dark/light mode support
- Color scheme variables
- Consistent spacing using theme tokens

## Authentication Integration

Some layouts integrate with authentication state:

- Conditional rendering based on user authentication status
- Protected routes and sections
- User-specific navigation items

## Performance Considerations

Layout components are optimized for performance:

- Minimal re-renders
- Efficient state management
- Code splitting for larger layouts
- Lazy loading of non-critical components
