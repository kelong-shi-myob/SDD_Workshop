/**
 * App Layout Component
 * 
 * Main application layout with header, navigation, and content area.
 * Includes theme toggle and language selector in the header.
 */

import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Main Application Layout
 * 
 * Provides consistent header with branding, theme toggle, and language selector.
 * Content area scrolls independently.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{t('app.title')}</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer (optional) */}
      <footer className="mt-auto border-t py-6 text-center text-sm text-muted-foreground">
        {t('app.description')}
      </footer>
    </div>
  );
}

