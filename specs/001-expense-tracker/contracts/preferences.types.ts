/**
 * User Preferences Types
 * 
 * Defines user interface settings (theme and language).
 * Persisted in localStorage to remember user choices across sessions.
 */

/**
 * Theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Language options (ISO 639-1 codes)
 */
export type Language = 'en' | 'zh';

/**
 * User preferences entity
 * 
 * Stores user's interface customization choices
 */
export interface UserPreferences {
  /** Color theme (light or dark mode) */
  theme: Theme;
  
  /** Interface language (English or Chinese) */
  language: Language;
}

/**
 * Default user preferences (initial state)
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en'
};

/**
 * Theme context interface (for React Context API)
 */
export interface ThemeContextValue {
  /** Current theme */
  theme: Theme;
  
  /** Toggle between light and dark */
  toggleTheme: () => void;
  
  /** Set specific theme */
  setTheme: (theme: Theme) => void;
}

/**
 * Language context interface (for React Context API)
 */
export interface LanguageContextValue {
  /** Current language */
  language: Language;
  
  /** Change language */
  setLanguage: (language: Language) => void;
  
  /** Toggle between English and Chinese */
  toggleLanguage: () => void;
}

