/**
 * Raw API response types from external providers.
 * These never reach UI — adapters normalize them into ContentItem.
 */

// ─── NewsAPI ───────────────────────────────────────────────────────
export interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

// ─── TMDB ──────────────────────────────────────────────────────────
export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
}

export interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

// ─── Social (mock) ─────────────────────────────────────────────────
export interface SocialPost {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  tags: string[];
}

export interface SocialResponse {
  posts: SocialPost[];
  total: number;
  page: number;
  pageSize: number;
}
