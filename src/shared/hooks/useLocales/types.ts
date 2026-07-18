export type Locale = 'ru' | 'en';
export type Location = 'common' | 'reading' | 'settings' | 'history' | 'daily';

export interface UseLocalesResult {
  translations: Record<string, string>;
  locale: Locale;
  changeLanguage: (id: Locale) => void;
  addTranslations: (
    translations: Record<Locale, Record<string, string>>,
  ) => void;
  i18n: (
    id: string,
    params?: Record<string, string | number>,
  ) => string;
}
