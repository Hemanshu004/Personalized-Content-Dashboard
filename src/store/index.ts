/**
 * Redux store configuration.
 *
 * State architecture:
 * - RTK Query (contentApi): owns all server/API state (news, movies, social, loading, errors, caching)
 * - preferences: user-selected categories, content types, language (persisted)
 * - favorites: set of favorited content IDs (persisted)
 * - feed: normalized content entities + custom display ordering (persisted order)
 * - ui: theme, sidebar, active view (theme persisted, rest session-only)
 */

import { configureStore } from '@reduxjs/toolkit';
import { contentApi } from '@/services/api/contentApi';
import preferencesReducer from '@/features/preferences/preferencesSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';
import readLaterReducer from '@/features/readLater/readLaterSlice';
import feedReducer from '@/features/feed/feedSlice';
import uiReducer from '@/features/ui/uiSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      [contentApi.reducerPath]: contentApi.reducer,
      preferences: preferencesReducer,
      favorites: favoritesReducer,
      readLater: readLaterReducer,
      feed: feedReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(contentApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
