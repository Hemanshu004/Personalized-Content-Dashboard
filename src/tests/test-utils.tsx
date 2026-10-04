import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { contentApi } from '@/services/api/contentApi';
import preferencesReducer from '@/features/preferences/preferencesSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';
import feedReducer from '@/features/feed/feedSlice';
import uiReducer from '@/features/ui/uiSlice';
import type { RootState } from '@/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const store = configureStore({
    reducer: {
      [contentApi.reducerPath]: contentApi.reducer,
      preferences: preferencesReducer,
      favorites: favoritesReducer,
      feed: feedReducer,
      ui: uiReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getDefaultMiddleware({ serializableCheck: false }).concat(contentApi.middleware as any),
  });

  function Wrapper({ children }: PropsWithChildren<Record<string, unknown>>): React.ReactElement {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
