/**
 * Normalizes mock social posts into ContentItem[].
 */

import type { ContentItem } from '@/types/content';
import type { SocialPost } from '@/types/api';

export function normalizeSocialPost(post: SocialPost): ContentItem {
  return {
    id: `social-${post.id}`,
    type: 'social',
    title: `${post.displayName} (@${post.username})`,
    description: post.content,
    image: post.image ?? null,
    source: 'Social',
    author: post.displayName,
    publishedAt: post.createdAt,
    category: 'general',
    url: '#',
    metadata: {
      avatar: post.avatar,
      username: post.username,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      tags: post.tags,
    },
  };
}

export function normalizeSocialResponse(posts: SocialPost[]): ContentItem[] {
  return posts.map(normalizeSocialPost);
}
