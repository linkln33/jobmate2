# Section Components

This directory contains high-level section components that make up the main content areas of JobMate's pages. These sections are composed of multiple UI components and provide complete functional areas of the application.

## Overview

Section components are larger, more complex components that typically:

1. **Represent complete page sections** - Each component represents a distinct section of a page
2. **Combine multiple UI components** - They compose smaller UI components into cohesive interfaces
3. **Handle section-specific logic** - They contain the business logic for their specific functionality
4. **Maintain their own state** - They often manage internal state relevant to their functionality

## Available Sections

### Landing Page Sections

These sections are primarily used on the marketing and landing pages:

- `feature-highlights-section.tsx` - Showcases key features of the platform with visual elements
- `how-it-works-section.tsx` - Explains the platform's workflow with step-by-step illustrations
- `testimonials-section.tsx` - Displays user testimonials and success stories
- `comparison-section.tsx` - Compares JobMate with competitors in a structured format
- `cta-section.tsx` - Call-to-action section for user conversion

### Functional Sections

These sections provide core application functionality:

- `marketplace-section.tsx` - Displays marketplace listings with filtering and search
- `onboarding-wizard-section.tsx` - Guides new users through the onboarding process
- `subscription-tiers-section.tsx` - Presents subscription options and pricing tiers
- `ai-assistant-section.tsx` - Interactive AI assistant interface for user guidance

## Usage Examples

### Basic Section Implementation

Sections are typically used directly in page components:

```tsx
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { FeatureHighlightsSection } from '@/components/sections/feature-highlights-section';
import { CTASection } from '@/components/sections/cta-section';

export default function HomePage() {
  return (
    <main>
      <HowItWorksSection />
      <FeatureHighlightsSection />
      <CTASection />
    </main>
  );
}
```

### Section with Custom Props

Many sections accept props for customization:

```tsx
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export default function AboutPage() {
  return (
    <main>
      <TestimonialsSection 
        title="What Our Specialists Say"
        testimonials={specialistTestimonials}
        variant="specialist"
      />
    </main>
  );
}
```

### Interactive Sections

Some sections handle user interactions and maintain state:

```tsx
import { OnboardingWizardSection } from '@/components/sections/onboarding-wizard-section';

export default function OnboardingPage() {
  return (
    <main>
      <OnboardingWizardSection 
        onComplete={handleOnboardingComplete}
        initialStep={2}
      />
    </main>
  );
}
```

## Section Component Structure

Most section components follow this general structure:

```tsx
export function ExampleSection({ 
  title = "Default Title",
  subtitle,
  items = [],
  variant = "default"
}: ExampleSectionProps) {
  // Section-specific state
  const [activeItem, setActiveItem] = useState(0);
  
  // Section-specific logic
  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        
        {/* Section content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card 
              key={index}
              active={index === activeItem}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Design Principles

Section components follow these design principles:

1. **Self-contained** - Each section should work independently
2. **Responsive** - Sections adapt to different screen sizes
3. **Customizable** - Accept props for content and behavior customization
4. **Consistent** - Follow consistent layout and styling patterns
5. **Accessible** - Adhere to accessibility best practices

## Data Integration

Many sections integrate with data from the `/src/data` directory:

- `how-it-works-section.tsx` uses data from `/src/data/how-it-works-steps.ts`
- `testimonials-section.tsx` uses data from `/src/data/testimonials.ts`
- `onboarding-wizard-section.tsx` uses data from `/src/data/onboarding-steps.tsx`
- `subscription-tiers-section.tsx` uses data from `/src/data/subscription-tiers.ts`

## Animation and Interactivity

Several sections incorporate animations and interactive elements:

- Scroll-triggered animations
- Hover effects
- Interactive cards and elements
- Transition effects between states

These are typically implemented using Framer Motion or CSS transitions.
