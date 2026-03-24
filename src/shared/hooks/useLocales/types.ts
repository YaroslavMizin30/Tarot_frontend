export type Locale = 'ru' | 'en';
export type Location = 'common' | 'reading' | 'settings' | 'result' | 'history';

export interface UseLocalesResult {
  translations: Record<string, string>;
  isLoading: boolean;
  changeLanguage: (id: Locale) => void;
  loadTranslations: (location: Location) => void;
  i18n: (id: string) => string;
}
