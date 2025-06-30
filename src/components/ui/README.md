# UI Components

This directory contains reusable UI components that form the foundation of JobMate's design system. These components are built with accessibility, consistency, and flexibility in mind.

## Overview

The UI components in this directory are designed to be:

1. **Reusable** - Components can be used across multiple pages and features
2. **Consistent** - Components follow a unified design language
3. **Accessible** - Components adhere to WCAG accessibility guidelines
4. **Customizable** - Components accept props for styling and behavior variations
5. **Performant** - Components are optimized for rendering performance

## Component Categories

### Core UI Elements

Basic building blocks for the user interface:

- `avatar.tsx` - User profile images with fallback support
- `badge.tsx` - Small status indicators and tags
- `button.tsx` - Various button styles and variants
- `card.tsx` - Container components for grouping related content
- `checkbox.tsx` - Form input for multiple selections
- `dialog.tsx` - Modal dialogs for focused interactions
- `dropdown-menu.tsx` - Expandable menus for navigation and actions
- `form.tsx` - Form components with validation support
- `input.tsx` - Text input fields
- `label.tsx` - Form field labels
- `popover.tsx` - Floating content containers
- `radio-group.tsx` - Form input for single selection from options
- `select.tsx` - Dropdown selection components
- `separator.tsx` - Visual dividers between content
- `sheet.tsx` - Slide-in panels for additional content
- `slider.tsx` - Range selection component
- `switch.tsx` - Toggle switches for binary options
- `tabs.tsx` - Tabbed interface for content organization
- `textarea.tsx` - Multi-line text input fields
- `tooltip.tsx` - Informational hover elements

### Data Display

Components for displaying and visualizing data:

- `comparison-table.tsx` - Side-by-side comparison of options
- `dynamic-chart.tsx` - Interactive data visualization
- `pagination.tsx` - Controls for paginated content
- `rating.tsx` - Star rating display and input
- `skeleton.tsx` - Loading placeholders for content
- `table.tsx` - Structured data display

### Feedback & Status

Components that provide user feedback:

- `alert.tsx` - Contextual feedback messages
- `progress.tsx` - Progress indicators
- `spinner.tsx` - Loading indicators
- `toast.tsx` - Brief notifications

### Specialized Components

Components with specific use cases:

- `ai-robot-face.tsx` - Animated AI assistant face
- `animated-ai-assistant.tsx` - Animated AI assistant with interactions
- `calendar.tsx` - Date selection and calendar display
- `compatibility-badge.tsx` - Match compatibility indicator
- `date-picker.tsx` - Date selection component
- `enhanced-compatibility-badge.tsx` - Advanced match compatibility indicator
- `expertise-badge.tsx` - Skill level indicator
- `feature-card.tsx` - Highlighted feature display
- `file-upload.tsx` - File upload interface
- `floating-ai-assistant.tsx` - Floating AI assistant UI
- `glass-card.tsx` - Frosted glass effect card
- `job-category-icon.tsx` - Icons for job categories
- `marketplace-preview-card.tsx` - Preview card for marketplace listings
- `multi-select.tsx` - Multiple item selection component
- `onboarding-wizard-preview.tsx` - Preview for onboarding steps
- `particle-background.tsx` - Animated particle background
- `search-input.tsx` - Search input with suggestions
- `section-header.tsx` - Styled section headers
- `social-login-button.tsx` - Authentication with social providers
- `step-card.tsx` - Card for step-by-step processes
- `sticky-navbar.tsx` - Navigation bar that sticks to viewport

## Usage Examples

### Basic Components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

function LoginForm() {
  return (
    <Card>
      <CardHeader>Login</CardHeader>
      <CardContent>
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" className="mt-2" />
      </CardContent>
      <CardFooter>
        <Button>Sign In</Button>
      </CardFooter>
    </Card>
  );
}
```

### Data Display Components

```tsx
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";

function DataTable({ data, page, setPage }) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHeader>
        {data.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </Table>
      <Pagination 
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Specialized Components

```tsx
import { CompatibilityBadge } from "@/components/ui/compatibility-badge";
import { FeatureCard } from "@/components/ui/feature-card";
import { MarketplacePreviewCard } from "@/components/ui/marketplace-preview-card";

function MatchDisplay({ match }) {
  return (
    <div>
      <CompatibilityBadge score={match.score} />
      <FeatureCard
        icon="star"
        title="Perfect Match"
        description="This specialist matches all your requirements"
      />
      <MarketplacePreviewCard listing={match.listing} />
    </div>
  );
}
```

## Styling

Components use Tailwind CSS for styling, with consistent class naming conventions. Many components support theme variants through the `variant` prop:

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

## Accessibility

All components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Sufficient color contrast

## Dependencies

- React
- Tailwind CSS
- Radix UI (for some primitive components)
- Lucide React (for icons)

## Contributing

When creating new UI components:

1. Follow the established naming conventions
2. Include comprehensive prop types with JSDoc comments
3. Ensure components are responsive
4. Test across different browsers and devices
5. Consider dark mode support
