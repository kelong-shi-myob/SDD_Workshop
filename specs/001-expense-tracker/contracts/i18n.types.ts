/**
 * Internationalization (i18n) Types
 * 
 * Defines the structure for translation strings and i18n utilities.
 * Used with react-i18next for English/Chinese language support.
 */

/**
 * Translation keys structure
 * 
 * Organized by feature area for maintainability
 */
export interface Translations {
  dashboard: {
    title: string;
    addExpense: string;
    noExpenses: string;
    recentExpenses: string;
    categoryTotals: string;
    exportCSV: string;
  };
  
  form: {
    amount: string;
    amountPlaceholder: string;
    date: string;
    category: string;
    categoryPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    submit: string;
    cancel: string;
    edit: string;
    delete: string;
  };
  
  categories: {
    Food: string;
    Transport: string;
    Entertainment: string;
    Shopping: string;
    Bills: string;
    Healthcare: string;
    Education: string;
    Other: string;
  };
  
  validation: {
    amountRequired: string;
    amountPositive: string;
    amountTooLarge: string;
    amountDecimal: string;
    dateRequired: string;
    dateFuture: string;
    dateInvalid: string;
    categoryRequired: string;
    descriptionTooLong: string;
  };
  
  currency: {
    symbol: string;
  };
  
  confirmation: {
    deleteTitle: string;
    deleteMessage: string;
    confirmButton: string;
    cancelButton: string;
  };
  
  notifications: {
    expenseAdded: string;
    expenseUpdated: string;
    expenseDeleted: string;
    csvExported: string;
    storageNearLimit: string;
    storageFull: string;
    storageError: string;
  };
  
  accessibility: {
    themeToggle: string;
    languageSelector: string;
    editExpense: string;
    deleteExpense: string;
    closeDialog: string;
  };
  
  errors: {
    loadFailed: string;
    saveFailed: string;
    quotaExceeded: string;
    parseError: string;
    unknown: string;
  };
}

/**
 * Type-safe translation key paths
 * 
 * Used with useTranslation hook: t('dashboard.title')
 */
export type TranslationKey = 
  | `dashboard.${keyof Translations['dashboard']}`
  | `form.${keyof Translations['form']}`
  | `categories.${keyof Translations['categories']}`
  | `validation.${keyof Translations['validation']}`
  | `currency.${keyof Translations['currency']}`
  | `confirmation.${keyof Translations['confirmation']}`
  | `notifications.${keyof Translations['notifications']}`
  | `accessibility.${keyof Translations['accessibility']}`
  | `errors.${keyof Translations['errors']}`;

/**
 * i18n configuration options
 */
export interface I18nConfig {
  /** Default language */
  defaultLanguage: Language;
  
  /** Fallback language if translation missing */
  fallbackLanguage: Language;
  
  /** Available languages */
  supportedLanguages: readonly Language[];
}

/**
 * Default i18n configuration
 */
export const I18N_CONFIG: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  supportedLanguages: ['en', 'zh'] as const
};

/**
 * Language metadata
 */
export interface LanguageMetadata {
  /** ISO 639-1 code */
  code: Language;
  
  /** Native name (how language refers to itself) */
  nativeName: string;
  
  /** English name */
  englishName: string;
  
  /** Text direction (ltr or rtl) */
  direction: 'ltr' | 'rtl';
}

/**
 * Language options for selector
 */
export const LANGUAGE_OPTIONS: readonly LanguageMetadata[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    direction: 'ltr'
  },
  {
    code: 'zh',
    nativeName: '中文',
    englishName: 'Chinese (Simplified)',
    direction: 'ltr'
  }
] as const;

// Type guard to ensure compile-time type safety
type Language = typeof I18N_CONFIG.supportedLanguages[number];

