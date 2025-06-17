# Price Calculator Integration

## Overview

The Price Calculator is a feature integrated into the JobMate AI Assistant that helps users estimate project costs based on various factors such as job category, complexity, experience level, location, and duration. This document describes the implementation details and usage of this feature.

## Components

### 1. Price Calculator Service

Located at `src/services/assistant/priceCalculator.ts`, this service provides:
- Job categories with base rates
- Complexity level multipliers
- Experience level multipliers
- Location-based adjustments
- Duration impact factors
- Core calculation logic for price estimates

### 2. UI Components

#### PriceEstimateCard

A specialized card component that displays price estimates in the AI Assistant panel. It provides:
- Visual differentiation with emerald color scheme
- Dollar sign icon to clearly indicate pricing information
- Collapsible detailed information
- Action buttons for getting detailed estimates

#### Dedicated Price Calculator Page

Located at `/project/price-calculator`, this page offers:
- Interactive form for detailed price estimation
- Real-time calculation as parameters change
- Detailed breakdown of cost factors
- Ability to use the estimate in project setup

### 3. Integration with Suggestion Engine

The price calculator is integrated with the suggestion engine to provide contextual price suggestions:
- Detects pricing-related keywords in user context
- Generates general price estimate suggestions
- Creates skill-specific price suggestions based on user profile
- Provides budget optimization tips during job creation

## User Experience

1. **Contextual Suggestions**: When users are in project setup or mention pricing-related terms, the AI Assistant automatically suggests price estimates.

2. **Interactive Estimates**: Users can interact with price suggestions to see more details or navigate to the full calculator.

3. **Detailed Calculator**: The dedicated page allows fine-tuning of all parameters for precise estimates.

4. **Seamless Integration**: Price estimates can be directly used in project setup workflows.

## Technical Implementation

### Data Flow

1. User context and mode are detected by the Assistant Context
2. Suggestion Engine generates appropriate price suggestions
3. AIAdaptivePanel renders these as PriceEstimateCards
4. User interactions are logged via AssistantMemoryLog
5. Detailed calculations are performed on the dedicated page

### Key Files

- `src/services/assistant/priceCalculator.ts`: Core calculation logic
- `src/components/assistant/PriceEstimateCard.tsx`: UI component for suggestions
- `src/app/project/price-calculator/page.tsx`: Dedicated calculator page
- `src/services/assistant/suggestionEngine.ts`: Integration with suggestion system

## Future Enhancements

- Integration with historical project data for more accurate estimates
- Machine learning model to refine estimates based on actual project outcomes
- Currency conversion for international projects
- Tax calculation based on user location
- Integration with payment processing for budget allocation
