'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useHydrated } from '@/hooks/useHydrated';
import { selectPreferences } from '@/features/preferences/preferencesSlice';
import {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery,
} from '@/services/api/contentApi';
import { ContentCard } from './ContentCard';
import { ContentCardSkeleton } from './ContentCardSkeleton';
import type { ContentItem } from '@/types/content';
import { AlertCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { selectFeedOrder, selectPendingNewItems, upsertFeedItems, receiveNewItems, flushNewItems, reorderFeed } from '@/features/feed/feedSlice';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { selectSearchQuery } from '@/features/ui/uiSlice';
import { useTranslation } from '@/hooks/useTranslation';

export function UnifiedFeed() {
  const dispatch = useAppDispatch();
  const isHydrated = useHydrated();
  const preferences = useAppSelector(selectPreferences);
  const orderedIds = useAppSelector(selectFeedOrder);
  const pendingNewItems = useAppSelector(selectPendingNewItems);
  const feedEntities = useAppSelector((state) => state.feed.entities);
  const globalSearchQuery = useAppSelector(selectSearchQuery);
  const { categories, contentTypes } = preferences;
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pageSize = 12;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px movement before drag starts, allows clicking buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch(reorderFeed({ activeId: active.id as string, overId: over.id as string }));
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Query toggles based on preferences
  const fetchNews = contentTypes.includes('news');
  const fetchMovies = contentTypes.includes('movie');
  const fetchSocial = contentTypes.includes('social');

  // Categories as a comma separated string for the API
  const categoryParam = categories.length > 0 ? categories.join(',') : undefined;

  // RTK Queries
  const {
    data: newsData,
    isFetching: newsFetching,
    error: newsError,
    refetch: refetchNews,
  } = useGetNewsQuery({ category: categoryParam, q: globalSearchQuery, page, pageSize }, { skip: !fetchNews });

  const {
    data: moviesData,
    isFetching: moviesFetching,
    error: moviesError,
    refetch: refetchMovies,
  } = useGetMoviesQuery({ q: globalSearchQuery, page, pageSize }, { skip: !fetchMovies });

  const {
    data: socialData,
    isFetching: socialFetching,
    error: socialError,
    refetch: refetchSocial,
  } = useGetSocialQuery({ q: globalSearchQuery, page, pageSize }, { skip: !fetchSocial });

  // Sync to feed slice for ordering
  useEffect(() => {
    const combined: ContentItem[] = [];
    if (newsData?.items) combined.push(...newsData.items);
    if (moviesData?.items) combined.push(...moviesData.items);
    if (socialData?.items) combined.push(...socialData.items);

    if (combined.length > 0) {
      dispatch(upsertFeedItems(combined));
    }
  }, [newsData, moviesData, socialData, dispatch]);

  // Real-time polling simulation
  useEffect(() => {
    if (!fetchSocial) return;

    const interval = setInterval(() => {
      const newItem: ContentItem = {
        id: `social-live-${Date.now()}`,
        title: `Real-time social update`,
        description: `This is a live update received at ${new Date().toLocaleTimeString()}`,
        type: 'social',
        category: 'technology',
        source: 'Twitter',
        author: 'LiveFeedBot',
        publishedAt: new Date().toISOString(),
        url: '#',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
        metadata: {
          platform: 'twitter',
          likes: 42,
        }
      };
      dispatch(receiveNewItems([newItem]));
    }, 15000); // Every 15 seconds for simulation

    return () => clearInterval(interval);
  }, [fetchSocial, dispatch]);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const isInitialLoading =
    (fetchNews && newsFetching && !newsData) ||
    (fetchMovies && moviesFetching && !moviesData) ||
    (fetchSocial && socialFetching && !socialData);

  const hasErrors = (fetchNews && newsError) || (fetchMovies && moviesError) || (fetchSocial && socialError);
  const isFetchingMore = (newsFetching || moviesFetching || socialFetching) && !isInitialLoading;

  const handleRetry = () => {
    if (fetchNews && newsError) refetchNews();
    if (fetchMovies && moviesError) refetchMovies();
    if (fetchSocial && socialError) refetchSocial();
  };

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  // Derive final display items using orderedIds + feedEntities
  const displayItems = orderedIds
    .map((id) => feedEntities[id])
    .filter((item): item is ContentItem => {
      if (!item) return false;
      // Filter by user's currently selected content types
      if (!contentTypes.includes(item.type)) return false;
      // Filter by user's currently selected categories
      if (categories.length > 0 && !categories.includes(item.category)) return false;
      
      // Filter by search query
      if (globalSearchQuery && globalSearchQuery.trim()) {
        const query = globalSearchQuery.trim().toLowerCase();
        const searchString = [
          item.title,
          item.description,
          item.source,
          item.author,
          item.category
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchString.includes(query)) {
          return false;
        }
      }
      
      return true;
    });

  if (isInitialLoading && displayItems.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (displayItems.length === 0 && !isFetchingMore && !hasErrors) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center animate-in fade-in zoom-in-95">
        <div className="mb-6 rounded-full bg-muted/50 p-4 ring-1 ring-border/50">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {globalSearchQuery ? `${t('noResults')} "${globalSearchQuery}"` : t('noResults')}
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {globalSearchQuery 
            ? "We couldn't find anything matching your search. Try adjusting your keywords or clearing the search."
            : "Try adjusting your content preferences in the settings to see more results."}
        </p>
      </div>
    );
  }

  const moviesItems = displayItems.filter(i => i.type === 'movie');
  const newsItems = displayItems.filter(i => i.type === 'news');
  const socialItems = displayItems.filter(i => i.type === 'social');

  return (
    <div className="space-y-8 pb-12">
      {pendingNewItems.length > 0 && (
        <div className="sticky top-20 z-20 flex justify-center pb-4">
          <button
            onClick={() => dispatch(flushNewItems())}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary-hover animate-in slide-in-from-top-4"
          >
            {t('newContent')} ({pendingNewItems.length})
          </button>
        </div>
      )}

      {hasErrors && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Some content sources failed to load.</span>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="space-y-12">
          {moviesItems.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-text-primary">{t('trendingMovies')}</h2>
              </div>
              <SortableContext items={moviesItems.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x px-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {moviesItems.map((item) => (
                    <div key={item.id} className="w-[200px] sm:w-[240px] shrink-0 snap-start">
                      <ContentCard item={item} isSortable />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </section>
          )}

          {newsItems.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-text-primary">{t('latestNews')}</h2>
              </div>
              <SortableContext items={newsItems.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x px-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {newsItems.map((item) => (
                    <div key={item.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                      <ContentCard item={item} isSortable />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </section>
          )}

          {socialItems.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-text-primary">{t('socialBuzz')}</h2>
              </div>
              <SortableContext items={socialItems.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x px-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {socialItems.map((item) => (
                    <div key={item.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                      <ContentCard item={item} isSortable />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </section>
          )}

          {isFetchingMore && (
            <div className="flex gap-4 overflow-hidden pt-4">
              <ContentCardSkeleton />
              <ContentCardSkeleton />
              <ContentCardSkeleton />
            </div>
          )}
        </div>
        
        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }) }}>
          {activeId ? (
            <div className="rotate-2 scale-105 opacity-90 shadow-2xl">
              <ContentCard item={displayItems.find(i => i.id === activeId)!} isSortable />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {displayItems.length > 0 && !isFetchingMore && (
        <div className="flex justify-center pt-8 border-t border-border/50">
          <button
            onClick={handleLoadMore}
            className="inline-flex h-10 items-center justify-center rounded-full bg-secondary px-8 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            Load More Content
          </button>
        </div>
      )}

      {isFetchingMore && (
        <div className="flex justify-center pt-8 border-t border-border/50">
          <button
            disabled
            className="inline-flex h-10 items-center justify-center rounded-full bg-secondary/50 px-8 text-sm font-medium text-secondary-foreground"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('loading')}
          </button>
        </div>
      )}
    </div>
  );
}
