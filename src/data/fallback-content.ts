/**
 * Fallback demo data served when external APIs are unavailable.
 * Allows the dashboard to remain functional without API keys.
 */

import type { ContentItem } from '@/types/content';

export const FALLBACK_NEWS: ContentItem[] = [
  {
    id: 'demo-news-001',
    type: 'news',
    title: 'Quantum Computing Breakthrough: New Error-Correction Method Achieves 99.9% Fidelity',
    description:
      'Researchers at MIT have demonstrated a novel quantum error-correction technique that could make practical quantum computers a reality within the decade.',
    image: null,
    source: 'TechReview',
    author: 'Dr. Emily Watson',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    category: 'technology',
    url: 'https://example.com/quantum-computing-breakthrough',
    metadata: { demo: true },
  },
  {
    id: 'demo-news-002',
    type: 'news',
    title: 'Global Markets Rally as Central Banks Signal Rate Stability',
    description:
      'Major stock indices gained 2-3% after coordinated statements from the Federal Reserve, ECB, and Bank of Japan indicated a pause in monetary tightening.',
    image: null,
    source: 'Financial Times',
    author: 'James Harrington',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    category: 'finance',
    url: 'https://example.com/global-markets-rally',
    metadata: { demo: true },
  },
  {
    id: 'demo-news-003',
    type: 'news',
    title: 'SpaceX Successfully Launches Next-Gen Starlink Satellites with Direct-to-Cell',
    description:
      'The latest batch of Starlink satellites includes direct-to-cell technology that will bring connectivity to remote areas without ground infrastructure.',
    image: null,
    source: 'Space News',
    author: 'Maria Chen',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: 'technology',
    url: 'https://example.com/spacex-starlink-launch',
    metadata: { demo: true },
  },
  {
    id: 'demo-news-004',
    type: 'news',
    title: 'New Study Links Mediterranean Diet to 30% Reduction in Heart Disease Risk',
    description:
      'A 15-year longitudinal study across 12 countries confirms significant cardiovascular benefits of a plant-forward Mediterranean eating pattern.',
    image: null,
    source: 'Health Journal',
    author: 'Dr. Sarah Kim',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    category: 'health',
    url: 'https://example.com/mediterranean-diet-study',
    metadata: { demo: true },
  },
  {
    id: 'demo-news-005',
    type: 'news',
    title: 'Premier League Transfer Window: Record-Breaking Deals Reshape Title Race',
    description:
      'This summer\'s transfer window has seen unprecedented spending, with the top six clubs investing over £2 billion combined.',
    image: null,
    source: 'SportsBeat',
    author: 'Tom Richardson',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'sports',
    url: 'https://example.com/premier-league-transfer',
    metadata: { demo: true },
  },
  {
    id: 'demo-news-006',
    type: 'news',
    title: 'CRISPR Gene Therapy Shows Promise in Treating Inherited Blindness',
    description:
      'Clinical trial results show partial vision restoration in patients with Leber congenital amaurosis using a single-injection CRISPR approach.',
    image: null,
    source: 'Science Daily',
    author: 'Dr. Robert Hayes',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    category: 'science',
    url: 'https://example.com/crispr-gene-therapy',
    metadata: { demo: true },
  },
];

export const FALLBACK_MOVIES: ContentItem[] = [
  {
    id: 'demo-movie-001',
    type: 'movie',
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.',
    image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    source: 'TMDB',
    author: null,
    publishedAt: '2010-07-16',
    category: 'entertainment',
    url: 'https://www.themoviedb.org/movie/27205',
    metadata: { voteAverage: 8.4, voteCount: 35000, demo: true },
  },
  {
    id: 'demo-movie-002',
    type: 'movie',
    title: 'Interstellar',
    description:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    source: 'TMDB',
    author: null,
    publishedAt: '2014-11-07',
    category: 'science',
    url: 'https://www.themoviedb.org/movie/157336',
    metadata: { voteAverage: 8.6, voteCount: 33000, demo: true },
  },
  {
    id: 'demo-movie-003',
    type: 'movie',
    title: 'The Social Network',
    description:
      'The story of Harvard student Mark Zuckerberg and the creation of the social networking website Facebook.',
    image: 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcZIu4.jpg',
    source: 'TMDB',
    author: null,
    publishedAt: '2010-10-01',
    category: 'entertainment',
    url: 'https://www.themoviedb.org/movie/37799',
    metadata: { voteAverage: 7.7, voteCount: 14000, demo: true },
  },
  {
    id: 'demo-movie-004',
    type: 'movie',
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with the Fremen while on a warpath of revenge against those who destroyed his family.',
    image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqc9zp.jpg',
    source: 'TMDB',
    author: null,
    publishedAt: '2024-03-01',
    category: 'entertainment',
    url: 'https://www.themoviedb.org/movie/693134',
    metadata: { voteAverage: 8.2, voteCount: 8000, demo: true },
  },
];
