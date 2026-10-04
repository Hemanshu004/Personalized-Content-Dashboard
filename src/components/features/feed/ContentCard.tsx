import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite, selectIsFavorite } from '@/features/favorites/favoritesSlice';
import type { ContentItem } from '@/types/content';
import { Heart, ExternalLink, Calendar, Star, MessageCircle, Share2, Film, FileText, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentCardProps {
  item: ContentItem;
  isSortable?: boolean;
}

export function ContentCard({ item, isSortable }: ContentCardProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, item.id));
  const [imgError, setImgError] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(item.id));
  };

  const getCtaText = () => {
    switch (item.type) {
      case 'news': return 'Read Article';
      case 'movie': return 'View Movie';
      case 'social': return 'View Post';
      default: return 'View Content';
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'news': return <FileText className="h-3 w-3" />;
      case 'movie': return <Film className="h-3 w-3" />;
      case 'social': return <MessageCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const formattedDate = new Date(item.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: !isSortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md bg-surface transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        !isDragging && "hover:scale-[1.03] hover:z-10 hover:shadow-xl shadow-md",
        isDragging && "shadow-2xl ring-2 ring-primary relative z-50 opacity-40 grayscale-[0.2]"
      )}
    >
      {/* Image container */}
      <div className={cn(
        "relative w-full overflow-hidden bg-surface-elevated shrink-0",
        item.type === 'movie' ? "aspect-[2/3]" : "aspect-video"
      )}>
        {item.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
            {getTypeIcon()}
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-sm border border-border/50">
          {getTypeIcon()}
          <span className="capitalize">{item.type}</span>
        </div>

        {/* Drag Handle */}
        {isSortable && (
          <div
            {...attributes}
            {...listeners}
            className={cn(
              "absolute left-1/2 top-3 -translate-x-1/2 z-20 flex h-8 w-8 cursor-grab items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:text-foreground active:cursor-grabbing",
              isDragging && "cursor-grabbing opacity-0" // Hide drag handle while dragging
            )}
            aria-label="Drag to reorder"
          >
            <GripHorizontal className="h-4 w-4" />
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={cn(
            "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-sm border border-border/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isFavorite ? "text-red-500 hover:bg-background/90" : "text-muted-foreground hover:text-red-500 hover:bg-background/90 opacity-0 group-hover:opacity-100 sm:opacity-100"
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4 bg-gradient-to-t from-surface via-surface to-surface-elevated/50 group-hover:from-surface-hover group-hover:via-surface-hover transition-colors duration-300">
        {/* Meta info depending on type */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {item.type === 'news' && (
            <>
              <span className="font-medium text-primary/80">{item.source}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="capitalize">{item.category}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            </>
          )}

          {item.type === 'movie' && (
            <>
              {item.metadata?.voteAverage != null && (
                <span className="flex items-center gap-1 font-medium text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {Number(item.metadata.voteAverage).toFixed(1)}
                </span>
              )}
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{formattedDate.split(',')[1]?.trim() || formattedDate}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="capitalize">{item.category}</span>
            </>
          )}

          {item.type === 'social' && (
            <>
              <span className="font-medium text-primary/80">{item.author || item.source}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="capitalize">{item.source}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{formattedDate}</span>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-text-primary group-hover:text-primary transition-colors">
          <a
            href={item.url !== '#' ? item.url : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none before:absolute before:inset-0"
            onClick={(e) => {
              if (item.url === '#') e.preventDefault();
            }}
          >
            {item.title}
          </a>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-text-secondary">
          {item.description}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100">
          <a
            href={item.url !== '#' ? item.url : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
            onClick={(e) => {
              if (item.url === '#') e.preventDefault();
            }}
          >
            {getCtaText()}
            <ExternalLink className="h-3 w-3" />
          </a>

          {item.type === 'social' && item.metadata && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground z-10 relative">
              {typeof item.metadata.likes === 'number' && (
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" /> {item.metadata.likes}
                </span>
              )}
              {typeof item.metadata.shares === 'number' && (
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" /> {item.metadata.shares}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
