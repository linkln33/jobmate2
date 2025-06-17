# Personalized Price Calculator

## Overview

The Personalized Price Calculator is an advanced feature of the JobMate AI assistant that provides users with tailored price estimates based on their historical interactions and preferences. This feature enhances the user experience by offering more relevant and personalized pricing suggestions for various project types.

## Features

### History-Aware Suggestions
- **User History Analysis**: Analyzes past user interactions stored in AssistantMemoryLog
- **Personalized Estimates**: Generates price estimates tailored to user's previous projects and preferences
- **Priority Ranking**: Prioritizes personalized suggestions over generic ones

### Integration with Assistant UI
- **Contextual Suggestions**: Appears when users are in job creation or project setup contexts
- **Interactive Price Cards**: Dedicated UI components for price-related suggestions
- **Direct Access**: Quick links to the full price calculator page

### Price Calculation Logic
- **Project Type Analysis**: Different calculation models based on project category
- **Complexity Factors**: Adjusts estimates based on project complexity
- **Duration Impact**: Considers project timeline in cost estimation

## Technical Implementation

### Core Components
- `priceCalculator.ts`: Main service handling price calculations and personalization
  - `calculatePriceEstimate`: Generates base price estimates for different project types
  - `getPersonalizedPriceEstimates`: Retrieves and processes user history to create personalized suggestions
  - `getUserPriceCalculatorHistory`: Fetches relevant history from AssistantMemoryLog

### Data Flow
1. User interacts with the assistant in a pricing-related context
2. System checks for existing user history in AssistantMemoryLog
3. If history exists, personalized suggestions are generated with higher priority
4. If no history, system falls back to skill-based generic suggestions
5. User interactions with price suggestions are logged for future personalization

### Integration with Suggestion Engine
- Enhanced `generatePriceCalculatorSuggestions` method in suggestionEngine.ts
- TypeScript fixes to ensure proper typing of suggestion modes and context fields
- Proper error handling for database operations

## User Experience Benefits

- **Reduced Decision Fatigue**: Users receive more relevant pricing options
- **Increased Accuracy**: Estimates improve over time as the system learns user preferences
- **Streamlined Workflow**: Quick access to pricing information during project creation
- **Consistent Experience**: Pricing suggestions maintain consistency with user's previous projects

## Future Enhancements

- **Machine Learning Integration**: Implement ML models to further refine price predictions
- **Market Rate Adjustments**: Automatically adjust estimates based on current market rates
- **Competitor Analysis**: Compare estimates with market averages
- **Budget Optimization**: Suggest ways to optimize project scope based on budget constraints
