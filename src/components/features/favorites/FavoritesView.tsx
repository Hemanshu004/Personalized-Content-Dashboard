'use client';

import { useAppSelector } from '@/store/hooks';
import { selectFavoriteIds } from '@/features/favorites/favoritesSlice';
import { ContentCard } from '@/components/features/feed/ContentCard';
import { Heart } from 'lucide-react';

export function FavoritesView() {
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const feedEntities = useAppSelector((state) => state.feed.entities);

  const favoriteItems = favoriteIds
    .map(id => feedEntities[id])
    .filter((item): item is NonNullable<typeof item> => item != null);

  if (favoriteItems.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in zoom-in-95">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No favorites yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Click the heart icon on any content card to save it to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
      {favoriteItems.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}
