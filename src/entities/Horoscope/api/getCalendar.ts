import camelize from 'camelize';

import type {
  MoonCalendarData,
  MoonCalendarEntry,
} from '../types';
import { toIsoDate } from '../lib/date';

import { backend } from '@/shared/api/backend';

interface CalendarRow {
  date: string;
  data: unknown;
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
  };
};

/**
 * Fetches calendar rows and normalizes their JSON columns.
 * One database row represents one calendar day.
 */
export const getCalendar = async (): Promise<MoonCalendarEntry[]> => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const dateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const response = await backend.invoke<{ entries: CalendarRow[] }>(
    'astrology-content',
    {
      action: 'moonCalendar',
      from: dateKey(firstDay),
      to: dateKey(lastDay),
    },
  );
  const rows = response.entries;

  if (!Array.isArray(rows)) {
    throw new Error('The moon calendar response has an invalid format');
  }

  const entries = rows
    .map(normalizeCalendarRow)
    .filter((entry): entry is MoonCalendarEntry => entry !== null);

  if (rows.length > 0 && entries.length === 0) {
    throw new Error('The moon calendar response has an invalid format');
  }

  return entries;
};
