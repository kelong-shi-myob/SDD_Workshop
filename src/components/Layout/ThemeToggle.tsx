/**
 * Theme Toggle Component
 * 
 * Button to toggle between light and dark themes.
 * Displays sun icon for light mode, moon icon for dark mode.
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

/**
 * Theme Toggle Button
 * 
 * Toggles between light and dark themes with accessible ARIA labels.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t('theme.toggle')}
      title={t('theme.toggle')}
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

