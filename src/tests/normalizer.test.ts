import { describe, it, expect } from 'vitest';
import { normalizeNewsArticle } from '@/services/news/normalizer';
import { normalizeTmdbMovie } from '@/services/movies/normalizer';
import { normalizeSocialPost } from '@/services/social/normalizer';
import type { SocialPost, TmdbMovie } from '@/types/api';

describe('API Normalizers', () => {
  it('normalizes a NewsAPI article correctly', () => {
    const rawArticle = {
      source: { id: 'techcrunch', name: 'TechCrunch' },
      author: 'Jane Doe',
      title: 'New Tech Announcement',
      description: 'A major announcement in tech.',
      url: 'https://example.com',
      urlToImage: 'https://example.com/image.jpg',
      publishedAt: '2023-10-01T12:00:00Z',
      content: 'Full content...',
    };

    const result = normalizeNewsArticle(rawArticle, 'technology');
    
    expect(result.type).toBe('news');
    expect(result.id).toMatch(/^news-/);
    expect(result.title).toBe('New Tech Announcement');
    expect(result.source).toBe('TechCrunch');
    expect(result.category).toBe('technology');
  });

  it('normalizes a TMDB movie correctly', () => {
    const rawMovie = {
      id: 12345,
      title: 'Inception',
      overview: 'A mind-bending thriller.',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2010-07-16',
      vote_average: 8.8,
      vote_count: 20000,
      popularity: 150.5,
      genre_ids: [28, 878],
    };

    const result = normalizeTmdbMovie(rawMovie as unknown as TmdbMovie);

    expect(result.type).toBe('movie');
    expect(result.id).toBe('movie-12345');
    expect(result.title).toBe('Inception');
    expect(result.category).toBe('entertainment');
    expect(result.metadata?.voteAverage).toBe(8.8);
    expect(result.image).toContain('/w500/poster.jpg');
  });

  it('normalizes a social post correctly', () => {
    const rawPost = {
      id: 'abc-123',
      userId: 'user-1',
      username: 'john_doe',
      displayName: 'John Doe',
      avatar: '/avatar.jpg',
      content: 'Hello world!',
      createdAt: '2023-10-01T12:00:00Z',
      likes: 10,
      comments: 2,
      shares: 1,
      tags: ['hello'],
    };

    const result = normalizeSocialPost(rawPost as unknown as SocialPost);

    expect(result.type).toBe('social');
    expect(result.id).toBe('social-abc-123');
    expect(result.author).toBe('John Doe');
    expect(result.description).toBe('Hello world!');
    expect(result.metadata?.likes).toBe(10);
  });
});
