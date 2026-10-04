'use client';

import { useAppSelector } from '@/store/hooks';
import { selectReadLaterIds } from '@/features/readLater/readLaterSlice';
import { ContentCard } from '@/components/features/feed/ContentCard';
import { Bookmark } from 'lucide-react';
import { useHydrated } from '@/hooks/useHydrated';

export function ReadLaterView() {
  const readLaterIds = useAppSelector(selectReadLaterIds);
  const feedEntities = useAppSelector((state) => state.feed.entities);
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const readLaterItems = readLaterIds
    .map((id) => feedEntities[id])
    .filter(Boolean)
    .reverse(); // Show newest first

  if (readLaterItems.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center animate-in fade-in zoom-in-95">
        <div className="mb-6 rounded-full bg-muted/50 p-4 ring-1 ring-border/50">
          <Bookmark className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          No saved articles yet
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Bookmark items from your feed to read them later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {readLaterItems.length} {readLaterItems.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {readLaterItems.map((item) => (
          <div key={item!.id} className="animate-in fade-in slide-in-from-bottom-4">
            <ContentCard item={item!} />
          </div>
        ))}
      </div>
    </div>
  );
}
