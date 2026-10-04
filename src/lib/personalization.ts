import type { ContentItem } from '@/types/content';
import type { UserPreferences } from '@/types/user';

export function getPersonalizationReason(item: ContentItem, preferences: UserPreferences): string {
  // Check if it matches explicit category preferences
  if (item.category && preferences.categories.includes(item.category)) {
    return `Because you follow ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}`;
  }

  // Check if it's highly popular/trending based on metadata
  if (item.metadata) {
    if (typeof item.metadata.likes === 'number' && item.metadata.likes > 500) {
      return "Trending right now";
    }
    if (typeof item.metadata.shares === 'number' && item.metadata.shares > 100) {
      return "Highly shared";
    }
    if (typeof item.metadata.voteAverage === 'number' && item.metadata.voteAverage > 8.0) {
      return "Critically acclaimed";
    }
    if (typeof item.metadata.popularity === 'number' && item.metadata.popularity > 100) {
      return "Trending right now";
    }
  }

  // Fallback reason
  return "Recommended for you";
}
