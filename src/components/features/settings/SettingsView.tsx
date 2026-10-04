'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import {
  toggleCategory,
  toggleContentType,
  resetPreferences,
} from '@/features/preferences/preferencesSlice';
import { setTheme, setLanguage, type Language } from '@/features/ui/uiSlice';
import { type ContentCategory, type ContentType } from '@/types/content';
import { type Theme } from '@/features/ui/uiSlice';
import { useHydrated } from '@/hooks/useHydrated';
import { Check, Moon, Sun, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const CATEGORIES: { id: ContentCategory; label: string }[] = [
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'finance', label: 'Finance' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
];

const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: 'news', label: 'News' },
  { id: 'movie', label: 'Movies' },
  { id: 'social', label: 'Social' },
];

export function SettingsView() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const theme = useAppSelector((state) => state.ui.theme);
  const isHydrated = useHydrated();
  const [resetMsg, setResetMsg] = useState(false);
  const { t, language } = useTranslation();

  // Avoid hydration mismatch by waiting for mount
  if (!isHydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <header>
          <div className="h-9 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-5 w-72 rounded-md bg-muted" />
        </header>
        <div className="h-96 w-full rounded-xl bg-muted" />
      </div>
    );
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all preferences to default?')) {
      dispatch(resetPreferences());
      setResetMsg(true);
      setTimeout(() => setResetMsg(false), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('settings')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('preferences')}
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Content Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Select the topics you want to see in your personalized feed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          {CATEGORIES.map((cat) => {
            const isSelected = preferences.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => dispatch(toggleCategory(cat.id))}
                aria-pressed={isSelected}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Content Sources
          </h2>
          <p className="text-sm text-muted-foreground">
            Filter the types of content appearing in your feed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          {CONTENT_TYPES.map((type) => {
            const isSelected = preferences.contentTypes.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => dispatch(toggleContentType(type.id))}
                aria-pressed={isSelected}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
                {type.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Language
            </h2>
            <p className="text-sm text-muted-foreground">
              Set your preferred language for content.
            </p>
          </div>
          <div className="pt-2">
            <select
              value={language}
              onChange={(e) => dispatch(setLanguage(e.target.value as Language))}
              aria-label="Select language"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              {t('theme')}
            </h2>
            <p className="text-sm text-muted-foreground">
              Customize the appearance of the application.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            {(['light', 'dark'] as Theme[]).map((t) => {
              const Icon = t === 'light' ? Sun : Moon;
              const isSelected = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => dispatch(setTheme(t))}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{t}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-destructive">
              Reset Preferences
            </h2>
            <p className="text-sm text-muted-foreground">
              Restore all settings and categories to their defaults.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {resetMsg && (
              <span className="text-sm font-medium text-primary animate-in fade-in">
                Preferences reset
              </span>
            )}
            <button
              onClick={handleReset}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Settings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
