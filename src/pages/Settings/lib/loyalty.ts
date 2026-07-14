import { type Spread } from "@/entities/Spread";


interface ReadingStats {
  readingsThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  totalReadings: number;
  lastReadingDate: string | null;
}

/**
 * Парсит дату из формата DD.MM.YYYY в объект Date (UTC, без времени)
 */
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Возвращает строку даты в формате YYYY-MM-DD (UTC)
 */
const formatDateKey = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Получает уникальные дни из массива раскладов
 */
const getUniqueDays = (readings: Spread[]): Set<string> => {
  const days = new Set<string>();
  for (const reading of readings) {
    const date = parseDate(reading.date);
    days.add(formatDateKey(date));
  }
  return days;
};

/**
 * Считает количество раскладов за указанный месяц
 */
export const countReadingsThisMonth = (
  readings: Spread[],
  referenceDate: Date = new Date(),
): number => {
  const currentMonth = referenceDate.getUTCMonth();
  const currentYear = referenceDate.getUTCFullYear();

  return readings.filter((reading) => {
    const date = parseDate(reading.date);
    return (
      date.getUTCMonth() === currentMonth &&
      date.getUTCFullYear() === currentYear
    );
  }).length;
};

/**
 * Считает текущую серию дней подряд (streak)
 * @param includeTodayIfEmpty - считать ли streak, если сегодня ещё не было расклада
 */
export const calculateCurrentStreak = (
  readings: Spread[],
  referenceDate: Date = new Date(),
  includeTodayIfEmpty: boolean = true,
): number => {
  const uniqueDays = getUniqueDays(readings);
  if (uniqueDays.size === 0) return 0;

  // Начинаем с сегодняшнего дня (или вчерашнего, если сегодня не было раскладов)
  const checkDate = new Date(referenceDate);
  const todayKey = formatDateKey(checkDate);

  if (!uniqueDays.has(todayKey)) {
    if (!includeTodayIfEmpty) return 0;
    // Откатываемся на день назад
    checkDate.setUTCDate(checkDate.getUTCDate() - 1);
  }

  let streak = 0;
  while (true) {
    const key = formatDateKey(checkDate);
    if (uniqueDays.has(key)) {
      streak++;
      checkDate.setUTCDate(checkDate.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Считает самую длинную серию дней за всё время
 */
export const calculateLongestStreak = (readings: Spread[]): number => {
  const uniqueDays = Array.from(getUniqueDays(readings)).sort();
  if (uniqueDays.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);

    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

/**
 * ⭐ Комплексная функция — возвращает всю статистику
 */
export const calculateReadingStats = (
  readings: Spread[],
  referenceDate: Date = new Date(),
): ReadingStats => {
  if (readings.length === 0) {
    return {
      readingsThisMonth: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalReadings: 0,
      lastReadingDate: null,
    };
  }

  // Сортируем по дате (новые сначала)
  const sorted = [...readings].sort((a, b) => {
    const [d1, m1, y1] = a.date.split('.').map(Number);
    const [d2, m2, y2] = b.date.split('.').map(Number);
    return (
      new Date(Date.UTC(y2, m2 - 1, d2)).getTime() -
      new Date(Date.UTC(y1, m1 - 1, d1)).getTime()
    );
  });

  return {
    readingsThisMonth: countReadingsThisMonth(readings, referenceDate),
    currentStreak: calculateCurrentStreak(readings, referenceDate),
    longestStreak: calculateLongestStreak(readings),
    totalReadings: readings.length,
    lastReadingDate: sorted[0].date,
  };
};
