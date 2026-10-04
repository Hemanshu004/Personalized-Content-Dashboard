'use client';

import { 
  LayoutDashboard, 
  Rss, 
  TrendingUp, 
  Heart, 
  Settings,
  Bookmark
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveView, setSidebarOpen, type ActiveView } from '@/features/ui/uiSlice';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { en } from '@/locales/en';

interface NavItem {
  id: ActiveView;
  label: keyof typeof en;
  icon: React.ElementType;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
  { id: 'feed', label: 'personalizedFeed', icon: Rss },
  { id: 'trending', label: 'trending', icon: TrendingUp },
  { id: 'favorites', label: 'favorites', icon: Heart },
  { id: 'readLater', label: 'readLater', icon: Bookmark },
  { id: 'settings', label: 'settings', icon: Settings },
];

interface NavigationProps {
  isMobile?: boolean;
}

export function Navigation({ isMobile }: NavigationProps) {
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) => state.ui.activeView);
  const isOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const { t } = useTranslation();

  const handleNavigate = (view: ActiveView) => {
    dispatch(setActiveView(view));
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Main Navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors border-l-2',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              isActive
                ? 'border-primary bg-surface-elevated text-text-primary'
                : 'border-transparent text-text-secondary hover:bg-surface hover:text-text-primary'
            )}
          >
            <Icon 
              className={cn(
                'h-5 w-5 shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'
              )} 
            />
            <span
              className={cn(
                'transition-all duration-300',
                !isOpen && !isMobile ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
              )}
            >
              {t(item.label)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
