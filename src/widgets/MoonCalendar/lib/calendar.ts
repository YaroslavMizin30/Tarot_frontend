import type { MoonCalendarEntry } from '@/entities/Horoscope';
import { toIsoDate } from '@/entities/Horoscope';

export type MonthCell =
  | { type: 'placeholder'; key: string }
  | {
    type: 'day';
    key: string;
    date: string;
    dayOfMonth: number;
    item?: MoonCalendarEntry;
  };

export const buildMonthCells = (
  anchor: Date,
  itemIndex: ReadonlyMap<string, MoonCalendarEntry>,
): MonthCell[] => {
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = (monthStart.getDay() + 6) % 7;

  const cells: MonthCell[] = Array.from(
    { length: firstWeekday },
    (_, index) => ({
      type: 'placeholder',
      key: `placeholder-${index}`,
    }),
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = toIsoDate(
      new Date(monthStart.getFullYear(), monthStart.getMonth(), day),
    );

    if (!date) {
      continue;
    }

    cells.push({
      type: 'day',
      key: date,
      date,
      dayOfMonth: day,
      item: itemIndex.get(date),
    });
  }

  return cells;
};
