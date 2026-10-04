import { describe, it, expect, beforeEach } from 'vitest';
import favoritesReducer, {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  selectFavoriteIds,
  selectIsFavorite,
} from '@/features/favorites/favoritesSlice';
import { STORAGE_KEYS } from '@/lib/constants';

describe('favoritesSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual({ ids: [] });
  });

  it('should handle addFavorite and duplicate prevention', () => {
    const state1 = favoritesReducer({ ids: [] }, addFavorite('item-1'));
    expect(state1.ids).toEqual(['item-1']);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]')).toEqual(['item-1']);

    // Duplicate prevention
    const state2 = favoritesReducer(state1, addFavorite('item-1'));
    expect(state2.ids).toEqual(['item-1']);
  });

  it('should handle removeFavorite', () => {
    const state = favoritesReducer({ ids: ['item-1', 'item-2'] }, removeFavorite('item-1'));
    expect(state.ids).toEqual(['item-2']);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]')).toEqual(['item-2']);
  });

  it('should handle toggleFavorite', () => {
    const state1 = favoritesReducer({ ids: [] }, toggleFavorite('item-3'));
    expect(state1.ids).toEqual(['item-3']);

    const state2 = favoritesReducer(state1, toggleFavorite('item-3'));
    expect(state2.ids).toEqual([]);
  });

  it('should provide working selectors', () => {
    const rootState = { favorites: { ids: ['test-id'] } };
    expect(selectFavoriteIds(rootState)).toEqual(['test-id']);
    expect(selectIsFavorite(rootState, 'test-id')).toBe(true);
    expect(selectIsFavorite(rootState, 'other-id')).toBe(false);
  });
});
