/**
 * Read Later slice — manages user's saved-for-later content IDs.
 * Persisted to localStorage.
 */

import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface ReadLaterState {
  ids: string[];
}

function loadInitialReadLater(): ReadLaterState {
  const stored = loadFromStorage<string[]>(STORAGE_KEYS.READ_LATER);
  return { ids: stored ?? [] };
}

const readLaterSlice = createSlice({
  name: 'readLater',
  initialState: loadInitialReadLater,
  reducers: {
    toggleReadLater(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.ids.indexOf(id);
      if (idx === -1) {
        state.ids.push(id);
      } else {
        state.ids.splice(idx, 1);
      }
      saveToStorage(STORAGE_KEYS.READ_LATER, state.ids);
    },
    removeReadLater(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
      saveToStorage(STORAGE_KEYS.READ_LATER, state.ids);
    },
    clearReadLater(state) {
      state.ids = [];
      saveToStorage(STORAGE_KEYS.READ_LATER, state.ids);
    },
  },
});

export const { toggleReadLater, removeReadLater, clearReadLater } = readLaterSlice.actions;

// Selectors
export const selectReadLaterIds = (state: { readLater: ReadLaterState }) => state.readLater.ids;
export const selectIsReadLater = createSelector(
  [selectReadLaterIds, (state, id: string) => id],
  (ids, id) => ids.includes(id)
);

export default readLaterSlice.reducer;
