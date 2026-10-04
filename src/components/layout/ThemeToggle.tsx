'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/features/ui/uiSlice';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useHydrated } from '@/hooks/useHydrated';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return (
      <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground" />
    );
  }

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun
        className={cn(
          'absolute h-[1.125rem] w-[1.125rem] transition-all',
          theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        )}
      />
      <Moon
        className={cn(
          'absolute h-[1.125rem] w-[1.125rem] transition-all',
          theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        )}
      />
    </button>
  );
}
