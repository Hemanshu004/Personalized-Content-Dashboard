/**
 * Server-side proxy for TMDB API.
 * Keeps API key on the server. Returns normalized ContentResponse.
 */

import { NextRequest } from 'next/server';
import type { TmdbResponse } from '@/types/api';
import type { ContentResponse } from '@/types/content';
import { normalizeTmdbResponse } from '@/services/movies/normalizer';
import { FALLBACK_MOVIES } from '@/data/fallback-content';
import { API_PAGE_SIZE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(
    searchParams.get('pageSize') ?? String(API_PAGE_SIZE),
    10,
  );

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    let filtered = FALLBACK_MOVIES;
    if (query) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase())
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
    const endpoint = query ? 'search/movie' : 'trending/movie/week';
    const params = new URLSearchParams({
      api_key: apiKey,
      page: String(page),
      language: 'en-US',
    });

    if (query) {
      params.set('query', query);
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?${params.toString()}`,
      { next: { revalidate: 300 } },
    );

    if (!res.ok) {
      throw new Error(`TMDB responded with ${res.status}`);
    }

    const data: TmdbResponse = await res.json();
    const items = normalizeTmdbResponse(data.results);

    return Response.json({
      items,
      pagination: {
        page,
        pageSize,
        totalResults: data.total_results,
        hasMore: data.page < data.total_pages,
      },
    } satisfies ContentResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch movies';

    let filtered = FALLBACK_MOVIES;
    if (query) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase())
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
