/**
 * Application-wide constants.
 */

export const STORAGE_KEYS = {
  PREFERENCES: 'pgagi_preferences',
  FAVORITES: 'pgagi_favorites',
  FEED_ORDER: 'pgagi_feed_order',
  THEME: 'pgagi_theme',
} as const;

export const CONTENT_CATEGORIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'finance', label: 'Finance' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'science', label: 'Science' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health' },
  { value: 'general', label: 'General' },
] as const;

export const CONTENT_TYPES = [
  { value: 'news', label: 'News' },
  { value: 'movie', label: 'Movies' },
  { value: 'social', label: 'Social' },
] as const;

export const API_PAGE_SIZE = 20;

export const SEARCH_DEBOUNCE_MS = 400;

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
