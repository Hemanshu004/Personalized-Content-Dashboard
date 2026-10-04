/**
 * User-related types for preferences and profile.
 */

import type { ContentCategory, ContentType } from './content';

export interface UserPreferences {
  categories: ContentCategory[];
  contentTypes: ContentType[];
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  categories: ['technology', 'science', 'entertainment'],
  contentTypes: ['news', 'movie', 'social'],
};
