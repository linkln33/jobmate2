# Assistant Analytics Dashboard

## Overview

The Assistant Analytics Dashboard provides comprehensive insights into how users interact with the JobMate AI assistant. This feature enables administrators and users to monitor usage patterns, engagement metrics, and effectiveness of the assistant across different modes and features.

## Features

### Usage Statistics
- **Mode-based Usage**: Track which assistant modes (PROJECT_SETUP, JOB_SEARCH, MARKETPLACE, etc.) are most frequently used
- **Interaction Type Analysis**: Analyze the types of interactions users have with the assistant
- **Time-based Trends**: View usage patterns over time (7, 30, or 90 days)

### Engagement Metrics
- **Suggestion Engagement Rate**: Percentage of suggestions that users click on vs. dismiss
- **Most Used Features**: Identify the most popular assistant features
- **Interaction Counts**: Total number of interactions with the assistant

### Interactive Visualizations
- **Charts and Graphs**: Visual representation of usage data
- **Filtering Options**: Filter data by time period
- **Tabbed Interface**: Organized view of different analytics categories

## Technical Implementation

### Backend Services
- `analyticsService.ts`: Core service that aggregates data from AssistantMemoryLog and other assistant-related tables
- Key methods:
  - `getAssistantUsageByMode`: Aggregates usage statistics by assistant mode
  - `getAssistantUsageByInteractionType`: Aggregates usage by interaction type
  - `getAssistantUsageOverTime`: Provides time-series data of assistant usage
  - `getSuggestionEngagementMetrics`: Calculates engagement metrics for suggestions
  - `getMostUsedFeatures`: Identifies most frequently used assistant features

### Frontend Components
- `AssistantAnalyticsDashboard.tsx`: Main dashboard component with charts and metrics
- `/assistant/analytics/page.tsx`: Page wrapper for the dashboard
- Integration with sidebar navigation for easy access

### Data Flow
1. User interactions with the assistant are logged to `AssistantMemoryLog` table
2. Analytics service queries and aggregates this data
3. Dashboard components visualize the aggregated data
4. Users can filter and explore different metrics

## Integration with Price Calculator

The analytics dashboard complements the personalized price estimate feature by:
- Tracking usage of the price calculator
- Providing insights into which price suggestions users engage with
- Helping optimize suggestion relevance based on usage patterns

## Future Enhancements

- **Predictive Analytics**: Implement ML-based prediction of user needs
- **Custom Reports**: Allow users to create and save custom analytics views
- **Export Functionality**: Enable exporting analytics data for external analysis
- **Real-time Monitoring**: Add real-time tracking of assistant usage
- **User Segmentation**: Analyze usage patterns across different user segments
