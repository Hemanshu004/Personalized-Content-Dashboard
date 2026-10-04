/**
 * Normalizes TMDB movie results into ContentItem[].
 */

import type { ContentItem } from '@/types/content';
import type { TmdbMovie } from '@/types/api';
import { TMDB_IMAGE_BASE } from '@/lib/constants';

/** TMDB genre_id → category mapping (subset of the full genre list). */
const GENRE_CATEGORY_MAP: Record<number, string> = {
  28: 'entertainment',  // Action
  12: 'entertainment',  // Adventure
  16: 'entertainment',  // Animation
  35: 'entertainment',  // Comedy
  80: 'entertainment',  // Crime
  99: 'science',        // Documentary
  18: 'entertainment',  // Drama
  10751: 'entertainment', // Family
  14: 'entertainment',  // Fantasy
  36: 'general',        // History
  27: 'entertainment',  // Horror
  10402: 'entertainment', // Music
  9648: 'entertainment',  // Mystery
  10749: 'entertainment', // Romance
  878: 'science',       // Science Fiction
  53: 'entertainment',  // Thriller
  10752: 'general',     // War
  37: 'entertainment',  // Western
};

function posterUrl(path: string | null): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w500${path}`;
}

export function normalizeTmdbMovie(movie: TmdbMovie): ContentItem {
  const primaryGenre = movie.genre_ids?.[0];
  const category = GENRE_CATEGORY_MAP[primaryGenre] ?? 'entertainment';

  return {
    id: `movie-${movie.id}`,
    type: 'movie',
    title: movie.title ?? '',
    description: movie.overview ?? '',
    image: posterUrl(movie.poster_path) ?? posterUrl(movie.backdrop_path),
    source: 'TMDB',
    author: null,
    publishedAt: movie.release_date ?? new Date().toISOString(),
    category: category as ContentItem['category'],
    url: `https://www.themoviedb.org/movie/${movie.id}`,
    metadata: {
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      backdropPath: movie.backdrop_path
        ? `${TMDB_IMAGE_BASE}/w780${movie.backdrop_path}`
        : null,
      genreIds: movie.genre_ids,
    },
  };
}

export function normalizeTmdbResponse(movies: TmdbMovie[]): ContentItem[] {
  return movies
    .filter((m) => m.title && m.overview)
    .map(normalizeTmdbMovie);
}
