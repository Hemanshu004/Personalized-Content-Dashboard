import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { ContentCard } from './ContentCard';
import type { ContentItem } from '@/types/content';
import userEvent from '@testing-library/user-event';

const mockNews: ContentItem = {
  id: 'news-1',
  type: 'news',
  title: 'Test News Title',
  description: 'Test News Description',
  source: 'TechCrunch',
  category: 'technology',
  url: 'https://example.com/news',
  publishedAt: '2023-01-01T00:00:00Z',
  image: null,
  author: 'Jane Doe',
  metadata: {},
};

const mockMovie: ContentItem = {
  id: 'movie-1',
  type: 'movie',
  title: 'Test Movie',
  description: 'Test Movie Description',
  source: 'TMDB',
  category: 'entertainment',
  url: 'https://example.com/movie',
  publishedAt: '2023-01-01T00:00:00Z',
  image: null,
  author: null,
  metadata: { voteAverage: 8.5 },
};

describe('ContentCard', () => {
  it('renders news content correctly', () => {
    renderWithProviders(<ContentCard item={mockNews} />);
    expect(screen.getByText('Test News Title')).toBeInTheDocument();
    expect(screen.getByText('Test News Description')).toBeInTheDocument();
    expect(screen.getByText('TechCrunch')).toBeInTheDocument();
    expect(screen.getByText('technology')).toBeInTheDocument();
    expect(screen.getByText('Read Article')).toBeInTheDocument();
  });

  it('renders movie content correctly with rating', () => {
    renderWithProviders(<ContentCard item={mockMovie} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument(); // Rating
    expect(screen.getByText('View Movie')).toBeInTheDocument();
  });

  it('can be favorited', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ContentCard item={mockNews} />);
    
    const favoriteBtn = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(favoriteBtn);
    
    const state = store.getState();
    expect(state.favorites.ids).toContain('news-1');
  });
});
