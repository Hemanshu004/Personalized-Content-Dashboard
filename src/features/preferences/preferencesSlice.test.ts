import { describe, it, expect, beforeEach } from 'vitest';
import preferencesReducer, {
  toggleCategory,
  toggleContentType,
  resetPreferences,
  selectPreferences,
  selectCategories,
} from '@/features/preferences/preferencesSlice';
import { DEFAULT_PREFERENCES } from '@/types/user';
import { STORAGE_KEYS } from '@/lib/constants';

describe('preferencesSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle initial state correctly (default state)', () => {
    expect(preferencesReducer(undefined, { type: 'unknown' })).toEqual(DEFAULT_PREFERENCES);
  });

  it('should handle toggleCategory (selecting and removing)', () => {
    // Add new category
    const state1 = preferencesReducer({ ...DEFAULT_PREFERENCES, categories: ['technology'] }, toggleCategory('sports'));
    expect(state1.categories).toEqual(['technology', 'sports']);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}').categories).toEqual(['technology', 'sports']);

    // Remove category
    const state2 = preferencesReducer(state1, toggleCategory('technology'));
    expect(state2.categories).toEqual(['sports']);

    // Should not remove the last category
    const state3 = preferencesReducer(state2, toggleCategory('sports'));
    expect(state3.categories).toEqual(['sports']);
  });

  it('should handle toggleContentType (selecting)', () => {
    const state1 = preferencesReducer({ ...DEFAULT_PREFERENCES, contentTypes: ['news'] }, toggleContentType('movie'));
    expect(state1.contentTypes).toEqual(['news', 'movie']);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}').contentTypes).toEqual(['news', 'movie']);
  });

  it('should handle resetPreferences', () => {
    const modifiedState = { ...DEFAULT_PREFERENCES, categories: ['sports' as const] };
    const actual = preferencesReducer(modifiedState, resetPreferences());
    expect(actual).toEqual(DEFAULT_PREFERENCES);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}')).toEqual(DEFAULT_PREFERENCES);
  });

  it('should provide working selectors', () => {
    const state = { preferences: DEFAULT_PREFERENCES };
    expect(selectPreferences(state)).toEqual(DEFAULT_PREFERENCES);
    expect(selectCategories(state)).toEqual(DEFAULT_PREFERENCES.categories);
  });
});
