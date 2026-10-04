'use client';

import { useAppSelector } from '@/store/hooks';
import { Navigation } from './Navigation';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

export function Sidebar() {
  const isOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar-bg transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-[72px]'
      )}
      aria-label="Desktop Sidebar"
    >
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Globe className="h-6 w-6" />
        </div>
        <span
          className={cn(
            'text-lg font-bold tracking-tight text-foreground transition-all duration-300',
            !isOpen && 'hidden opacity-0'
          )}
        >
          Aggregator
        </span>
      </div>
      
      {/* 
        When collapsed (isOpen=false), we could hide labels in Navigation 
        but since the prompt says "collapse behavior if useful", 
        I'll keep it simple: just hide the whole sidebar or hide the text.
        Given the prompt asks for clean implementation, let's just make the sidebar fixed width 64
        when open, and totally hidden when closed, or icon-only. 
        Icon only needs some tweaks in Navigation. For now, if we want an elegant MVP:
        We will pass isOpen to Navigation to hide labels. 
      */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Navigation isMobile={false} />
      </div>
    </aside>
  );
}
