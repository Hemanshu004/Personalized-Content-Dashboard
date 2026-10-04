/**
 * RTK Query base API configuration.
 * All content endpoints are defined here.
 * Server state (API responses) lives in RTK Query cache — NOT duplicated into slices.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ContentResponse } from '@/types/content';

interface ContentQueryParams {
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['News', 'Movies', 'Social'],
  keepUnusedDataFor: 300, // Cache for 5 minutes
  endpoints: (builder) => ({
    // ─── News ──────────────────────────────────────────────────
    getNews: builder.query<ContentResponse, ContentQueryParams>({
      query: ({ category = 'general', q, page = 1, pageSize = 20 }) => ({
        url: '/news',
        params: { category, q, page, pageSize },
      }),
      providesTags: ['News'],
      // Merge pages for infinite scroll
      serializeQueryArgs: ({ queryArgs }) => {
        const cleanArgs = { ...queryArgs };
        delete cleanArgs.page;
        return cleanArgs;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          items: [...currentCache.items, ...newItems.items],
          pagination: newItems.pagination,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
    }),

    // ─── Movies ────────────────────────────────────────────────
    getMovies: builder.query<ContentResponse, ContentQueryParams>({
      query: ({ q, page = 1, pageSize = 20 }) => ({
        url: '/movies',
        params: { q, page, pageSize },
      }),
      providesTags: ['Movies'],
      serializeQueryArgs: ({ queryArgs }) => {
        const cleanArgs = { ...queryArgs };
        delete cleanArgs.page;
        return cleanArgs;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          items: [...currentCache.items, ...newItems.items],
          pagination: newItems.pagination,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
    }),

    // ─── Social ────────────────────────────────────────────────
    getSocial: builder.query<ContentResponse, ContentQueryParams>({
      query: ({ q, page = 1, pageSize = 20 }) => ({
        url: '/social',
        params: { q, page, pageSize },
      }),
      providesTags: ['Social'],
      serializeQueryArgs: ({ queryArgs }) => {
        const cleanArgs = { ...queryArgs };
        delete cleanArgs.page;
        return cleanArgs;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          items: [...currentCache.items, ...newItems.items],
          pagination: newItems.pagination,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery,
} = contentApi;
