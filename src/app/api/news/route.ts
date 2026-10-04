/**
 * Server-side proxy for NewsAPI.
 * Keeps API key on the server. Returns normalized ContentResponse.
 */

import { NextRequest } from 'next/server';
import type { NewsApiResponse } from '@/types/api';
import type { ContentResponse } from '@/types/content';
import { normalizeNewsResponse } from '@/services/news/normalizer';
import { FALLBACK_NEWS } from '@/data/fallback-content';
import { API_PAGE_SIZE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category') ?? 'general';
  const query = searchParams.get('q') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(
    searchParams.get('pageSize') ?? String(API_PAGE_SIZE),
    10,
  );

  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    // Return fallback data when no API key is configured
    let filtered = FALLBACK_NEWS;
    if (query) {
      filtered = filtered.filter((n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    return Response.json({
      items: slice,
      pagination: {
        page,
        pageSize,
        totalResults: filtered.length,
        hasMore: start + pageSize < filtered.length,
      },
    } satisfies ContentResponse);
  }

  try {
    const endpoint = query ? 'everything' : 'top-headlines';
    const params = new URLSearchParams({
      apiKey,
      page: String(page),
      pageSize: String(pageSize),
      language: 'en',
    });

    if (query) {
      params.set('q', query);
      params.set('sortBy', 'relevancy');
    } else {
      params.set('category', category);
      params.set('country', 'us');
    }

    const res = await fetch(
      `https://newsapi.org/v2/${endpoint}?${params.toString()}`,
      { next: { revalidate: 300 } },
    );

    if (!res.ok) {
      throw new Error(`NewsAPI responded with ${res.status}`);
    }

    const data: NewsApiResponse = await res.json();
    const items = normalizeNewsResponse(data.articles, category);

    return Response.json({
      items,
      pagination: {
        page,
        pageSize,
        totalResults: data.totalResults,
        hasMore: page * pageSize < data.totalResults,
      },
    } satisfies ContentResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch news';

    // Serve fallback on error so dashboard remains usable
    let filtered = FALLBACK_NEWS;
    if (query) {
      filtered = filtered.filter((n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);

    return Response.json(
      {
        items: slice,
        pagination: {
          page,
          pageSize,
          totalResults: filtered.length,
          hasMore: start + pageSize < filtered.length,
        },
        _fallback: true,
        _error: message,
      },
      { status: 200 },
    );
  }
}
