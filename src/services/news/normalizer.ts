/**
 * Normalizes NewsAPI articles into ContentItem[].
 */

import type { ContentCategory, ContentItem } from '@/types/content';
import type { NewsApiArticle } from '@/types/api';

/** Map NewsAPI category strings to our ContentCategory enum. */
function mapNewsCategory(category?: string): ContentCategory {
  const map: Record<string, ContentCategory> = {
    technology: 'technology',
    tech: 'technology',
    sports: 'sports',
    sport: 'sports',
    business: 'business',
    finance: 'finance',
    entertainment: 'entertainment',
    science: 'science',
    health: 'health',
  };
  return map[category?.toLowerCase() ?? ''] ?? 'general';
}

export function normalizeNewsArticle(
  article: NewsApiArticle,
  category?: string,
): ContentItem {
  return {
    id: `news-${btoa(article.url).slice(0, 32)}`,
    type: 'news',
    title: article.title ?? '',
    description: article.description ?? '',
    image: article.urlToImage ?? null,
    source: article.source?.name ?? 'Unknown',
    author: article.author ?? null,
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    category: mapNewsCategory(category),
    url: article.url ?? '#',
    metadata: {
      sourceId: article.source?.id,
    },
  };
}

export function normalizeNewsResponse(
  articles: NewsApiArticle[],
  category?: string,
): ContentItem[] {
  return articles
    .filter((a) => a.title && a.title !== '[Removed]')
    .map((a) => normalizeNewsArticle(a, category));
}
