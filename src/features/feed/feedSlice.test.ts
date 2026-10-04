import { describe, it, expect, beforeEach } from 'vitest';
import feedReducer, {
  upsertFeedItems,
  receiveNewItems,
  flushNewItems,
  reorderFeed,
  resetFeedOrder,
} from '@/features/feed/feedSlice';
import { STORAGE_KEYS } from '@/lib/constants';
import type { ContentItem } from '@/types/content';

describe('feedSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockItem1 = { id: '1', title: 'Test 1', type: 'news', source: 'test', publishedAt: '', url: '' } as ContentItem;
  const mockItem2 = { id: '2', title: 'Test 2', type: 'news', source: 'test', publishedAt: '', url: '' } as ContentItem;

  it('should return initial state', () => {
    const state = feedReducer(undefined, { type: 'unknown' });
    expect(state.orderedIds).toEqual([]);
    expect(state.hasCustomOrder).toBe(false);
  });

  it('should handle upsertFeedItems and default ordering', () => {
    const state = feedReducer(undefined, upsertFeedItems([mockItem1, mockItem2]));
    expect(state.ids).toEqual(['1', '2']);
    expect(state.orderedIds).toEqual(['1', '2']); // Falls back to entity ids
    expect(state.hasCustomOrder).toBe(false);
  });

  it('should handle reorderFeed and persist custom order', () => {
    const state1 = feedReducer(undefined, upsertFeedItems([mockItem1, mockItem2]));
    const state2 = feedReducer(state1, reorderFeed({ activeId: '2', overId: '1' }));
    
    expect(state2.orderedIds).toEqual(['2', '1']);
    expect(state2.hasCustomOrder).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.FEED_ORDER) || '[]')).toEqual(['2', '1']);
  });

  it('should handle resetFeedOrder', () => {
    let state = feedReducer(undefined, upsertFeedItems([mockItem1, mockItem2]));
    state = feedReducer(state, reorderFeed({ activeId: '2', overId: '1' }));
    state = feedReducer(state, resetFeedOrder());
    
    expect(state.orderedIds).toEqual(['1', '2']);
    expect(state.hasCustomOrder).toBe(false);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.FEED_ORDER) || 'null')).toEqual([]);
  });

  it('should preserve custom order and append new items when new data arrives', () => {
    let state = feedReducer(undefined, upsertFeedItems([mockItem1, mockItem2]));
    // Reorder: 2, 1
    state = feedReducer(state, reorderFeed({ activeId: '2', overId: '1' }));
    
    // New data arrives: mockItem1 (duplicate), mockItem2 (duplicate), mockItem3 (new)
    const mockItem3 = { id: '3', title: 'Test 3', type: 'news', source: 'test', publishedAt: '', url: '' } as ContentItem;
    state = feedReducer(state, upsertFeedItems([mockItem1, mockItem2, mockItem3]));

    // Should preserve custom order for 2 and 1, and append 3 at the end
    expect(state.orderedIds).toEqual(['2', '1', '3']);
    expect(state.hasCustomOrder).toBe(true);
    
    // New data arrives with another new item
    const mockItem4 = { id: '4', title: 'Test 4', type: 'news', source: 'test', publishedAt: '', url: '' } as ContentItem;
    state = feedReducer(state, upsertFeedItems([mockItem4]));
    
    expect(state.orderedIds).toEqual(['2', '1', '3', '4']);
  });

  it('should handle receiveNewItems and flushNewItems', () => {
    let state = feedReducer(undefined, upsertFeedItems([mockItem1, mockItem2]));
    expect(state.orderedIds).toEqual(['1', '2']);
    
    const mockItem3 = { id: '3', title: 'Test 3', type: 'social', source: 'test', publishedAt: '', url: '' } as ContentItem;
    state = feedReducer(state, receiveNewItems([mockItem3]));
    
    // Should be added to pending, not orderedIds
    expect(state.orderedIds).toEqual(['1', '2']);
    expect(state.pendingNewItems).toEqual(['3']);
    
    // Flush should prepend
    state = feedReducer(state, flushNewItems());
    expect(state.orderedIds).toEqual(['3', '1', '2']);
    expect(state.pendingNewItems).toEqual([]);
  });
});
