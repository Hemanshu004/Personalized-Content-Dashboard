'use client';

import { Menu } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { toggleSidebar } from '@/features/ui/uiSlice';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { cn } from '@/lib/utils';

export function Header() {
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#2A2A2A] bg-[#1F1F1F] dark:border-border dark:bg-black/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            'lg:hidden',
            'inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors',
            'text-[#B3B3B3] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
          )}
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex flex-1 max-w-md">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Show search icon on mobile instead of full bar to save space */}
        <div className="sm:hidden flex items-center justify-center h-9 w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer">
          {/* Real mobile search would expand here, but for now just the icon */}
          <Menu className="h-5 w-5 hidden" />
        </div>
        <ThemeToggle />
        <div className="h-6 w-px bg-[#2A2A2A] hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
}
