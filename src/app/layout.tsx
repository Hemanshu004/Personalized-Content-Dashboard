import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import ThemeProvider from '@/components/common/ThemeProvider';
import { NextAuthProvider } from '@/components/common/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Content Dashboard — Personalized Feed',
  description:
    'A personalized content dashboard aggregating news, movie recommendations, and social posts into a unified, customizable feed.',
};

/**
 * Inline script that runs before paint to set the correct theme class
 * on <html>, preventing a flash of the wrong theme on page load.
 */
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('pgagi_theme');
    var theme = stored ? JSON.parse(stored) : 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <StoreProvider>
          <NextAuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </NextAuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
