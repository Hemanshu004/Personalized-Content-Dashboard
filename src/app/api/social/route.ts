/**
 * Social API route — serves mock social data behind the same
 * service abstraction as real APIs.
 * Simulates realistic latency and supports loading/error/empty states.
 */

import { NextRequest } from 'next/server';
import type { ContentResponse } from '@/types/content';
import { normalizeSocialResponse } from '@/services/social/normalizer';
import { MOCK_SOCIAL_POSTS } from '@/data/social-posts';
import { API_PAGE_SIZE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

/** Simulate network latency (200-600ms). */
function simulateLatency(): Promise<void> {
  const delay = 200 + Math.random() * 400;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q')?.toLowerCase() ?? '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(
    searchParams.get('pageSize') ?? String(API_PAGE_SIZE),
    10,
  );

  await simulateLatency();

  let filtered = MOCK_SOCIAL_POSTS;

  if (query) {
    filtered = MOCK_SOCIAL_POSTS.filter(
      (post) =>
        post.content.toLowerCase().includes(query) ||
        post.displayName.toLowerCase().includes(query) ||
        post.username.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);
  const items = normalizeSocialResponse(slice);

  return Response.json({
    items,
    pagination: {
      page,
      pageSize,
      totalResults: filtered.length,
      hasMore: start + pageSize < filtered.length,
    },
  } satisfies ContentResponse);
}
