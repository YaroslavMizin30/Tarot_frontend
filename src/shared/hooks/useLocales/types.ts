export type Locale = 'ru' | 'en';
export type Location = 'common' | 'reading' | 'settings' | 'history' | 'daily';

export interface UseLocalesResult {
  translations: Record<string, string>;
  isLoading: boolean;
  locale: Locale;
  changeLanguage: (id: Locale) => void;
  loadTranslations: (location: Location) => void;
  addTranslations: (
    translations: Record<Locale, Record<string, string>>,
  ) => void;
  i18n: (id: string) => string;
}
