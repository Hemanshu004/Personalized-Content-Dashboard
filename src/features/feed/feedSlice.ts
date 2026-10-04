/**
 * Feed slice — manages content ordering for drag-and-drop and entity lookup.
 * Uses createEntityAdapter for normalized content entities.
 *
 * Architecture:
 * - `entities` / `ids`: normalized ContentItem store (via createEntityAdapter)
 * - `orderedIds`: user-customized display order (for drag-and-drop)
 * - Content is populated from RTK Query results, not duplicated
 *
 * This allows API refresh, pagination, dedup, DnD, favorites, and filtering
 * without duplicating complete content objects across slices.
 */

import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { ContentItem } from '@/types/content';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

const contentAdapter = createEntityAdapter<ContentItem>();

interface FeedExtra {
  /** User-customized display order (persisted). Falls back to entity ids. */
  orderedIds: string[];
  /** Tracks whether user has ever reordered (so we know to use orderedIds). */
  hasCustomOrder: boolean;
  /** IDs of newly received items waiting to be shown to the user */
  pendingNewItems: string[];
}

function loadInitialOrder(): FeedExtra {
  const stored = loadFromStorage<string[]>(STORAGE_KEYS.FEED_ORDER);
  if (stored && stored.length > 0) {
    return { orderedIds: stored, hasCustomOrder: true, pendingNewItems: [] };
  }
  return { orderedIds: [], hasCustomOrder: false, pendingNewItems: [] };
}

const initialExtra = loadInitialOrder();

const feedSlice = createSlice({
  name: 'feed',
  initialState: contentAdapter.getInitialState<FeedExtra>(initialExtra),
  reducers: {
    /** Upsert items from API responses (deduplicates automatically). */
    upsertFeedItems(state, action: PayloadAction<ContentItem[]>) {
      contentAdapter.upsertMany(state, action.payload);

      // If user hasn't customized order, sync orderedIds with entity ids
      if (!state.hasCustomOrder) {
        state.orderedIds = state.ids as string[];
      } else {
        // Add new items that aren't in the custom order yet
        const existing = new Set(state.orderedIds);
        const newIds = (state.ids as string[]).filter(
          (id) => !existing.has(id),
        );
        state.orderedIds = [...state.orderedIds, ...newIds];
      }
    },

    /** Receive new real-time items. Adds to entities and pending queue. */
    receiveNewItems(state, action: PayloadAction<ContentItem[]>) {
      const existingIds = new Set(state.ids);
      const newItems = action.payload.filter((item) => !existingIds.has(item.id));
      if (newItems.length > 0) {
        contentAdapter.upsertMany(state, newItems);
        state.pendingNewItems.unshift(...newItems.map((item) => item.id));
      }
    },

    /** Flush pending new items into the main feed order. */
    flushNewItems(state) {
      if (state.pendingNewItems.length > 0) {
        state.orderedIds = [...state.pendingNewItems, ...state.orderedIds];
        state.pendingNewItems = [];
        if (state.hasCustomOrder) {
          saveToStorage(STORAGE_KEYS.FEED_ORDER, state.orderedIds);
        }
      }
    },

    /** Reorder feed (drag-and-drop). */
    reorderFeed(
      state,
      action: PayloadAction<{ activeId: string; overId: string }>,
    ) {
      const { activeId, overId } = action.payload;
      const source = state.orderedIds;
      const oldIndex = source.indexOf(activeId);
      const newIndex = source.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) return;

      source.splice(oldIndex, 1);
      source.splice(newIndex, 0, activeId);

      state.hasCustomOrder = true;
      saveToStorage(STORAGE_KEYS.FEED_ORDER, state.orderedIds);
    },

    /** Reset to default order. */
    resetFeedOrder(state) {
      state.orderedIds = state.ids as string[];
      state.hasCustomOrder = false;
      saveToStorage(STORAGE_KEYS.FEED_ORDER, []);
    },

    /** Clear all feed data. */
    clearFeed(state) {
      contentAdapter.removeAll(state);
      state.orderedIds = [];
      state.hasCustomOrder = false;
    },
  },
});

export const { upsertFeedItems, receiveNewItems, flushNewItems, reorderFeed, resetFeedOrder, clearFeed } =
  feedSlice.actions;

// Entity adapter selectors
export const feedSelectors = contentAdapter.getSelectors();

// Feed order selectors
export const selectFeedOrder = (state: { feed: ReturnType<typeof feedSlice.reducer> }) => state.feed.orderedIds;
export const selectPendingNewItems = (state: { feed: ReturnType<typeof feedSlice.reducer> }) => state.feed.pendingNewItems;

export default feedSlice.reducer;
