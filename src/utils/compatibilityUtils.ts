import { CompatibilityResult, MainCategory } from '@/types/compatibility';

/**
 * Get a human-readable description of the compatibility score
 */
export function getScoreDescription(score: number): string {
  if (score >= 90) return 'Excellent Match';
  if (score >= 80) return 'Great Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Decent Match';
  if (score >= 50) return 'Moderate Match';
  if (score >= 40) return 'Fair Match';
  return 'Low Match';
}

/**
 * Get the color for a compatibility score
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return '#10B981'; // Green for excellent match
  if (score >= 70) return '#3B82F6'; // Blue for good match
  if (score >= 50) return '#F59E0B'; // Yellow for moderate match
  return '#EF4444'; // Red for poor match
}

/**
 * Get CSS class name for a compatibility score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 85) return 'text-emerald-500';
  if (score >= 70) return 'text-blue-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * Get a personalized message based on compatibility score and category
 */
export function getPersonalizedMessage(result: CompatibilityResult): string {
  const { overallScore, category, primaryMatchReason } = result;
  
  if (overallScore >= 85) {
    switch (category) {
      case 'jobs':
        return `This job is a perfect match for your skills and preferences! ${primaryMatchReason}`;
      case 'services':
        return `This service aligns excellently with what you're looking for! ${primaryMatchReason}`;
      case 'rentals':
        return `This rental property is exactly what you need! ${primaryMatchReason}`;
      case 'marketplace':
        return `This item is a perfect match for what you're looking for! ${primaryMatchReason}`;
      case 'favors':
        return `This favor request is perfectly aligned with your abilities! ${primaryMatchReason}`;
      default:
        return `This is an excellent match for you! ${primaryMatchReason}`;
    }
  }
  
  if (overallScore >= 70) {
    switch (category) {
      case 'jobs':
        return `This job is a good match for your career goals. ${primaryMatchReason}`;
      case 'services':
        return `This service meets most of your requirements. ${primaryMatchReason}`;
      case 'rentals':
        return `This rental property has many features you're looking for. ${primaryMatchReason}`;
      case 'marketplace':
        return `This item matches well with your preferences. ${primaryMatchReason}`;
      case 'favors':
        return `This favor aligns well with your skills. ${primaryMatchReason}`;
      default:
        return `This is a good match for you. ${primaryMatchReason}`;
    }
  }
  
  if (overallScore >= 50) {
    return `This ${category.slice(0, -1)} is a moderate match. ${primaryMatchReason}`;
  }
  
  return `This ${category.slice(0, -1)} doesn't match your preferences well.`;
}

/**
 * Get category-specific icon name
 */
export function getCategoryIcon(category: MainCategory): string {
  switch (category) {
    case 'jobs':
      return 'briefcase';
    case 'services':
      return 'tools';
    case 'rentals':
      return 'home';
    case 'marketplace':
      return 'shopping-bag';
    case 'favors':
      return 'handshake';
    case 'holiday':
      return 'umbrella-beach';
    case 'art':
      return 'palette';
    case 'giveaways':
      return 'gift';
    case 'learning':
      return 'book';
    case 'community':
      return 'users';
    default:
      return 'star';
  }
}

/**
 * Format a compatibility dimension for display
 */
export function formatDimension(name: string, score: number): string {
  return `${name}: ${score}%`;
}

/**
 * Get top matching dimensions from a compatibility result
 */
export function getTopDimensions(result: CompatibilityResult, count: number = 3): Array<{name: string, score: number}> {
  return [...result.dimensions]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(dim => ({
      name: dim.name,
      score: dim.score
    }));
}

/**
 * Get improvement areas from a compatibility result
 */
export function getImprovementAreas(result: CompatibilityResult, count: number = 3): Array<{name: string, score: number}> {
  return [...result.dimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(dim => ({
      name: dim.name,
      score: dim.score
    }));
}
