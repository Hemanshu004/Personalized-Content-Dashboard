'use client';

/**
 * Applies the correct theme class to <html> based on Redux state.
 * Handles system preference detection and prevents flash of wrong theme
 * by reading localStorage synchronously in the layout's inline script.
 */

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}
