import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { UnifiedFeed } from './UnifiedFeed';
import { useGetNewsQuery, useGetMoviesQuery, useGetSocialQuery } from '@/services/api/contentApi';
import { fireEvent, act } from '@testing-library/react';
import { setSearchQuery } from '@/features/ui/uiSlice';

// Stable default data to prevent useEffect infinite loops
const defaultMockData = { items: [], pagination: { hasMore: false, page: 1 } };

// Mock the API hooks
vi.mock('@/services/api/contentApi', async () => {
  const actual = await vi.importActual('@/services/api/contentApi');
  return {
    ...actual as Record<string, unknown>,
    useGetNewsQuery: vi.fn(() => ({
      data: defaultMockData,
      isFetching: false,
      error: null,
    })),
    useGetMoviesQuery: vi.fn(() => ({
      data: defaultMockData,
      isFetching: false,
      error: null,
    })),
    useGetSocialQuery: vi.fn(() => ({
      data: defaultMockData,
      isFetching: false,
      error: null,
    })),
  };
});

describe('UnifiedFeed', () => {
  it('renders empty state when no content is available', () => {
    // The default mocked hooks return empty arrays
    renderWithProviders(<UnifiedFeed />);
    
    // We expect the "No results" empty state
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your content preferences/)).toBeInTheDocument();
  });

  it('renders sortable content cards when data is available', () => {
    // Mock the query return value just for this test
    const mockNewsData = {
      items: [
        {
          id: 'news-1',
          type: 'news',
          title: 'Draggable News Article',
          description: 'Test news',
          source: 'Tech',
          category: 'technology',
          url: '#',
          publishedAt: '2023-01-01T00:00:00Z',
          image: null,
          metadata: {},
        }
      ],
      pagination: { hasMore: false, page: 1 }
    };

    vi.mocked(useGetNewsQuery).mockReturnValue({
      data: mockNewsData,
      isFetching: false,
      error: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderWithProviders(<UnifiedFeed />);

    // Content should be present
    expect(screen.getByText('Draggable News Article')).toBeInTheDocument();

    // Drag handle should be present since it's sortable
    expect(screen.getByLabelText('Drag to reorder')).toBeInTheDocument();
  });

  describe('Debounced Search', () => {
    const mockSearchData = {
      items: [
        {
          id: 'news-1',
          type: 'news',
          title: 'Dune Part Two Trailer',
          description: 'A look at the sands of Arrakis.',
          source: 'MovieWeb',
          category: 'entertainment',
          url: '#',
          publishedAt: '2023-01-01T00:00:00Z',
          image: null,
          metadata: {},
        },
        {
          id: 'news-2',
          type: 'news',
          title: 'Quantum Computing Breakthrough',
          description: 'Scientists discover new qubit stability method.',
          source: 'TechNews',
          author: 'Alice Smith',
          category: 'science',
          url: '#',
          publishedAt: '2023-01-02T00:00:00Z',
          image: null,
          metadata: {},
        }
      ],
      pagination: { hasMore: false, page: 1 }
    };

    beforeEach(() => {
      vi.mocked(useGetNewsQuery).mockReturnValue({
        data: mockSearchData,
        isFetching: false,
        error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      
      vi.mocked(useGetMoviesQuery).mockReturnValue({
        data: defaultMockData,
        isFetching: false,
        error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      
      vi.mocked(useGetSocialQuery).mockReturnValue({
        data: defaultMockData,
        isFetching: false,
        error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('filters case-insensitively using global search state', async () => {
      const { store } = renderWithProviders(<UnifiedFeed />);
      
      expect(screen.getByText('Dune Part Two Trailer')).toBeInTheDocument();
      expect(screen.getByText('Quantum Computing Breakthrough')).toBeInTheDocument();
      
      // Update global search to 'dune'
      act(() => {
        store.dispatch(setSearchQuery('dune'));
      });
      
      // Now it should be filtered
      expect(screen.queryByText('Quantum Computing Breakthrough')).not.toBeInTheDocument();
      expect(screen.getByText('Dune Part Two Trailer')).toBeInTheDocument();
    });

    it('shows no-results state for non-existent text', async () => {
      const { store } = renderWithProviders(<UnifiedFeed />);
      
      act(() => {
        store.dispatch(setSearchQuery('xyz123'));
      });
      
      expect(screen.getByText('No results "xyz123"')).toBeInTheDocument();
      expect(screen.queryByText('Dune Part Two Trailer')).not.toBeInTheDocument();
      
      act(() => {
        store.dispatch(setSearchQuery(''));
      });
      
      // Results restored
      expect(screen.getByText('Dune Part Two Trailer')).toBeInTheDocument();
      expect(screen.getByText('Quantum Computing Breakthrough')).toBeInTheDocument();
    });
  });
});
