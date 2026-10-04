'use client';

import { useAppSelector } from '@/store/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SettingsView } from '@/components/features/settings/SettingsView';
import { UnifiedFeed } from '@/components/features/feed/UnifiedFeed';
import { FavoritesView } from '@/components/features/favorites/FavoritesView';
import { ReadLaterView } from '@/components/features/readLater/ReadLaterView';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const activeView = useAppSelector((state) => state.ui.activeView);
  const { t } = useTranslation();

  const viewVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  // Temporary placeholders for Phase 3 visual verification
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
      case 'feed':
        return (
          <motion.div key={activeView} variants={viewVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col w-full">
            {activeView === 'dashboard' && (
              <div className="relative w-full h-[60vh] min-h-[400px] max-h-[700px] bg-surface flex items-center mb-8">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-10" />
                <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2500" alt="Hero Background" className="w-full h-full object-cover opacity-60" />
                </div>
                
                <div className="relative z-20 px-4 sm:px-8 lg:px-12 max-w-3xl flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-primary font-bold tracking-widest text-xs uppercase">N Series</span>
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight">
                    STRANGER<br />THINGS
                  </h1>
                  <p className="text-base sm:text-lg text-gray-200 mt-2 line-clamp-3">
                    When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and a strange little girl.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <button className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-colors">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      {t('play')}
                    </button>
                    <button className="bg-gray-500/50 hover:bg-gray-500/70 text-white px-8 py-3 rounded-md font-bold flex items-center gap-2 backdrop-blur-sm transition-colors border border-gray-400/20">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                      {t('moreInfo')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className={cn("px-4 sm:px-6 lg:px-8", activeView !== 'dashboard' && "pt-8")}>
              {activeView !== 'dashboard' && (
                <header className="flex flex-col gap-1.5 pb-6">
                  <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    {t('personalizedFeed')}
                  </h1>
                  <p className="text-base text-text-secondary">
                    {t('allSources')}
                  </p>
                </header>
              )}
              <UnifiedFeed />
            </div>
          </motion.div>
        );
      case 'trending':
        return (
          <motion.div key="trending" variants={viewVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1.5 pb-2">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                {t('trending')}
              </h1>
              <p className="text-base text-text-secondary">
                {t('mostPopular')}
              </p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CardPlaceholder />
              <CardPlaceholder />
              <CardPlaceholder />
            </div>
          </motion.div>
        );
      case 'favorites':
        return (
          <motion.div key="favorites" variants={viewVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1.5 pb-2">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                {t('favorites')}
              </h1>
              <p className="text-base text-text-secondary">
                {t('contentSaved')}
              </p>
            </header>
            <FavoritesView />
          </motion.div>
        );
      case 'readLater':
        return (
          <motion.div key="readLater" variants={viewVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1.5 pb-2">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                {t('readLater')}
              </h1>
              <p className="text-base text-text-secondary">
                Content you want to read later.
              </p>
            </header>
            <ReadLaterView />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div key="settings" variants={viewVariants} initial="initial" animate="animate" exit="exit" className="px-4 py-8 sm:px-6 lg:px-8">
            <SettingsView />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function CardPlaceholder() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="h-40 w-full rounded-md bg-muted animate-skeleton" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded bg-muted animate-skeleton" />
        <div className="h-4 w-full rounded bg-muted animate-skeleton" />
        <div className="h-4 w-5/6 rounded bg-muted animate-skeleton" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-4 w-20 rounded bg-muted animate-skeleton" />
        <div className="h-8 w-8 rounded-full bg-muted animate-skeleton" />
      </div>
    </div>
  );
}
