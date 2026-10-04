import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageFallbackProps {
  className?: string;
}

export function ImageFallback({ className }: ImageFallbackProps) {
  return (
    <div 
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-surface border border-border/50 text-muted-foreground/50",
        className
      )}
      aria-label="No image available"
    >
      <ImageIcon className="h-8 w-8 opacity-40" />
      <span className="text-xs font-medium opacity-60">No image available</span>
    </div>
  );
}
