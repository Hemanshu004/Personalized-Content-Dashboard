/**
 * Favorites slice — manages user's favorited content IDs.
 * Persisted to localStorage.
 * Only stores IDs — actual content data lives in RTK Query cache.
 */

import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface FavoritesState {
  ids: string[];
}

function loadInitialFavorites(): FavoritesState {
  const stored = loadFromStorage<string[]>(STORAGE_KEYS.FAVORITES);
  return { ids: stored ?? [] };
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: loadInitialFavorites,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.ids.indexOf(id);
      if (idx === -1) {
        state.ids.push(id);
      } else {
        state.ids.splice(idx, 1);
      }
      saveToStorage(STORAGE_KEYS.FAVORITES, state.ids);
    },
    addFavorite(state, action: PayloadAction<string>) {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
        saveToStorage(STORAGE_KEYS.FAVORITES, state.ids);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
      saveToStorage(STORAGE_KEYS.FAVORITES, state.ids);
    },
    clearFavorites(state) {
      state.ids = [];
      saveToStorage(STORAGE_KEYS.FAVORITES, state.ids);
    },
  },
});


export const { toggleFavorite, addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

// Selectors
export const selectFavoriteIds = (state: { favorites: FavoritesState }) => state.favorites.ids;
export const selectIsFavorite = createSelector(
  [selectFavoriteIds, (state, id: string) => id],
  (ids, id) => ids.includes(id)
);

export default favoritesSlice.reducer;
