import camelize from 'camelize';

import type {
  MoonCalendarData,
  MoonCalendarEntry,
  MoonCalendarLocalization,
} from '../types';
import { toIsoDate } from '../lib/date';

import { getDataFromDB } from '@/shared/api/supabase';

interface CalendarRow {
  date: string;
  data: unknown;
  en: unknown;
  ru: unknown;
}

const parseJsonObject = <T extends object>(value: unknown): T | null => {
  let parsed = value;

  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value) as unknown;
    } catch {
      return null;
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null;
  }

  return camelize(parsed) as T;
};

const normalizeCalendarRow = (
  row: CalendarRow,
): MoonCalendarEntry | null => {
  const date = toIsoDate(row.date);
  const data = parseJsonObject<MoonCalendarData>(row.data);

  if (!date || !data) {
    return null;
  }

  return {
    date,
    data,
    en: parseJsonObject<MoonCalendarLocalization>(row.en),
    ru: parseJsonObject<MoonCalendarLocalization>(row.ru),
  };
};

/**
 * Fetches calendar rows and normalizes their JSON columns.
 * One database row represents one calendar day.
 */
export const getCalendar = async (): Promise<MoonCalendarEntry[]> => {
  const rows = await getDataFromDB<CalendarRow>('calendar', {
    key: 'type',
    value: 'moon',
  });

  if (rows === null) {
    throw new Error('Failed to load the moon calendar');
  }

  const entries = rows
    .map(normalizeCalendarRow)
    .filter((entry): entry is MoonCalendarEntry => entry !== null);

  if (rows.length > 0 && entries.length === 0) {
    throw new Error('The moon calendar response has an invalid format');
  }

  return entries;
};
