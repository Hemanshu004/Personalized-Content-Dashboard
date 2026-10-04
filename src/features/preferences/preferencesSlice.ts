/**
 * Preferences slice — manages user content preferences.
 * Persisted to localStorage.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ContentCategory, ContentType } from '@/types/content';
import type { UserPreferences } from '@/types/user';
import { DEFAULT_PREFERENCES } from '@/types/user';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

function loadInitialPreferences(): UserPreferences {
  const stored = loadFromStorage<UserPreferences>(STORAGE_KEYS.PREFERENCES);
  return stored ?? DEFAULT_PREFERENCES;
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: loadInitialPreferences,
  reducers: {
    setCategories(state, action: PayloadAction<ContentCategory[]>) {
      state.categories = action.payload;
      saveToStorage(STORAGE_KEYS.PREFERENCES, state);
    },
    toggleCategory(state, action: PayloadAction<ContentCategory>) {
      const idx = state.categories.indexOf(action.payload);
      if (idx === -1) {
        state.categories.push(action.payload);
      } else if (state.categories.length > 1) {
        // Prevent removing the last category
        state.categories.splice(idx, 1);
      }
      saveToStorage(STORAGE_KEYS.PREFERENCES, state);
    },
    setContentTypes(state, action: PayloadAction<ContentType[]>) {
      state.contentTypes = action.payload;
      saveToStorage(STORAGE_KEYS.PREFERENCES, state);
    },
    toggleContentType(state, action: PayloadAction<ContentType>) {
      const idx = state.contentTypes.indexOf(action.payload);
      if (idx === -1) {
        state.contentTypes.push(action.payload);
      } else if (state.contentTypes.length > 1) {
        state.contentTypes.splice(idx, 1);
      }
      saveToStorage(STORAGE_KEYS.PREFERENCES, state);
    },

    resetPreferences(state) {
      Object.assign(state, DEFAULT_PREFERENCES);
      saveToStorage(STORAGE_KEYS.PREFERENCES, state);
    },
  },
});

export const {
  setCategories,
  toggleCategory,
  setContentTypes,
  toggleContentType,
  resetPreferences,
} = preferencesSlice.actions;

// Selectors
export const selectPreferences = (state: { preferences: UserPreferences }) => state.preferences;
export const selectCategories = (state: { preferences: UserPreferences }) => state.preferences.categories;
export const selectContentTypes = (state: { preferences: UserPreferences }) => state.preferences.contentTypes;

export default preferencesSlice.reducer;
