import type { Locale } from '@/shared/hooks/useLocales';

/**
 * Сокращённые названия дней недели по локалям.
 * Используются в заголовке сетки календаря.
 */
export const WEEKDAYS_BY_LOCALE: Record<Locale, string[]> = {
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
};
