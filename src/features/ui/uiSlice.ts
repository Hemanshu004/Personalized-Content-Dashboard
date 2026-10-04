/**
 * UI slice — manages global UI state.
 * Theme is persisted to localStorage.
 * Sidebar state and active view are session-only.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'hi';
export type ActiveView =
  | 'dashboard'
  | 'feed'
  | 'trending'
  | 'favorites'
  | 'readLater'
  | 'settings';

interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
  activeView: ActiveView;
  searchQuery: string;
  language: Language;
}

function loadInitialTheme(): Theme {
  const stored = loadFromStorage<Theme>(STORAGE_KEYS.THEME);
  return stored ?? 'dark';
}

const initialState: UiState = {
  theme: loadInitialTheme(),
  sidebarOpen: true,
  activeView: 'dashboard',
  searchQuery: '',
  language: loadFromStorage<Language>('pgagi_language') ?? 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      saveToStorage(STORAGE_KEYS.THEME, state.theme);
    },
    toggleTheme(state) {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = next;
      saveToStorage(STORAGE_KEYS.THEME, state.theme);
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveView(state, action: PayloadAction<ActiveView>) {
      state.activeView = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
      saveToStorage('pgagi_language', state.language);
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setActiveView,
  setSearchQuery,
  setLanguage,
} = uiSlice.actions;

export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
export const selectSidebarOpen = (state: { ui: UiState }) => state.ui.sidebarOpen;
export const selectActiveView = (state: { ui: UiState }) => state.ui.activeView;
export const selectSearchQuery = (state: { ui: UiState }) => state.ui.searchQuery;
export const selectLanguage = (state: { ui: UiState }) => state.ui.language;

export default uiSlice.reducer;
