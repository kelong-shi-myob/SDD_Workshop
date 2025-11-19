/**
 * Language Selector Component
 * 
 * Dropdown or button to switch between English and Chinese languages.
 * Updates i18n and persists preference to localStorage.
 */

import { Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

/**
 * Language Selector Dropdown
 * 
 * Allows users to select between English and Chinese.
 * Displays current language and available options.
 */
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as 'en' | 'zh')}
      >
        <SelectTrigger className="w-[140px]" aria-label={t('language.toggle')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('language.english')}</SelectItem>
          <SelectItem value="zh">{t('language.chinese')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Compact Language Toggle Button
 * 
 * Alternative compact design that toggles between languages on click.
 */
export function LanguageToggleButton() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t('language.toggle')}
      title={t('language.toggle')}
    >
      <Languages className="h-4 w-4 mr-2" />
      {language === 'en' ? 'EN' : '中文'}
    </Button>
  );
}

