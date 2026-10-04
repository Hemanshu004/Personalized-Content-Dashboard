export function ContentCardSkeleton() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-video w-full overflow-hidden bg-muted animate-pulse">
        {/* Badge skeleton */}
        <div className="absolute left-3 top-3 h-6 w-20 rounded-full bg-border/50" />
        {/* Favorite skeleton */}
        <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-border/50" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Meta info skeleton */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          <div className="h-1 w-1 rounded-full bg-border" />
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-muted animate-pulse" />
          <div className="h-5 w-4/5 rounded bg-muted animate-pulse" />
        </div>

        {/* Description skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full rounded bg-muted/70 animate-pulse" />
          <div className="h-3 w-full rounded bg-muted/70 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted/70 animate-pulse" />
        </div>

        {/* Footer skeleton */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
