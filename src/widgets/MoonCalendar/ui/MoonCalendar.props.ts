import type { MoonCalendarEntry } from '@/entities/Horoscope';
import type { Locale } from '@/shared/hooks/useLocales';

export interface MoonCalendarProps {
  items: MoonCalendarEntry[];
  locale: Locale;
  selectedDate: string | null;
  onDaySelect: (item: MoonCalendarEntry) => void;
  className?: string;
}
