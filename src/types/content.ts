/**
 * Unified content model — the single contract between API services and UI.
 * Every provider adapter normalizes its response into this shape.
 */

export type ContentType = 'news' | 'movie' | 'social';

export type ContentCategory =
  | 'technology'
  | 'sports'
  | 'finance'
  | 'entertainment'
  | 'science'
  | 'business'
  | 'health'
  | 'general';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image: string | null;
  source: string;
  author: string | null;
  publishedAt: string;
  category: ContentCategory;
  url: string;
  metadata: Record<string, unknown>;
}

/** Page-based pagination cursor returned by API routes */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalResults: number | null;
  hasMore: boolean;
}

/** Standard envelope returned by our Next.js API routes */
export interface ContentResponse {
  items: ContentItem[];
  pagination: PaginationMeta;
}

/** Error shape returned by our Next.js API routes */
export interface ApiError {
  message: string;
  code: string;
  status: number;
}
