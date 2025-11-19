/**
 * Language Context
 * 
 * Provides language management (i18n) across the application.
 * Persists language preference to localStorage and integrates with i18next.
 */

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Language, LanguageContextValue } from '@/types/preferences';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Language Provider Component
 * 
 * Wraps the application to provide language context.
 * Automatically syncs with i18next when language changes.
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useLocalStorage<Language>(
    'sdd_workshop_expense_tracker_language',
    'en'
  );

  // Sync with i18next when language changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  /**
   * Change the application language
   * 
   * @param newLanguage - The language to switch to ('en' or 'zh')
   */
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  /**
   * Toggle between English and Chinese
   */
  const toggleLanguage = () => {
    setLanguageState((prevLanguage) => (prevLanguage === 'en' ? 'zh' : 'en'));
  };

  const value: LanguageContextValue = {
    language,
    setLanguage,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 * 
 * @throws Error if used outside LanguageProvider
 * @returns LanguageContextValue with language state and setters
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { language, toggleLanguage } = useLanguage();
 *   
 *   return (
 *     <button onClick={toggleLanguage}>
 *       Current language: {language}
 *     </button>
 *   );
 * }
 * ```
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}

