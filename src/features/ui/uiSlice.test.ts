import { describe, it, expect, beforeEach } from 'vitest';
import uiReducer, {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  setActiveView,
  setSearchQuery,
  setLanguage,
} from '@/features/ui/uiSlice';
import { STORAGE_KEYS } from '@/lib/constants';

describe('uiSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const initialState = {
    theme: 'dark' as const,
    sidebarOpen: true,
    activeView: 'dashboard' as const,
    searchQuery: '',
    language: 'en' as const,
  };

  it('should return initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setTheme and persist', () => {
    const state = uiReducer(initialState, setTheme('dark'));
    expect(state.theme).toBe('dark');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME) || '""')).toBe('dark');
  });

  it('should handle toggleTheme', () => {
    const state1 = uiReducer({ ...initialState, theme: 'light' }, toggleTheme());
    expect(state1.theme).toBe('dark');
    
    const state2 = uiReducer(state1, toggleTheme());
    expect(state2.theme).toBe('light');
  });

  it('should handle setSidebarOpen', () => {
    const state = uiReducer(initialState, setSidebarOpen(false));
    expect(state.sidebarOpen).toBe(false);
  });

  it('should handle setSearchQuery', () => {
    const state = uiReducer(initialState, setSearchQuery('test query'));
    expect(state.searchQuery).toBe('test query');
  });

  it('should handle setActiveView', () => {
    const state = uiReducer(initialState, setActiveView('settings'));
    expect(state.activeView).toBe('settings');
  });

  it('should handle setLanguage and persist', () => {
    const state = uiReducer(initialState, setLanguage('hi'));
    expect(state.language).toBe('hi');
    expect(JSON.parse(localStorage.getItem('pgagi_language') || '""')).toBe('hi');
  });
});
