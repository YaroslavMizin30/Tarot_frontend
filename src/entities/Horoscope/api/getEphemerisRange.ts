import type { EphemerisByRangeResponse } from '../types';

import { backend } from '@/shared/api/backend';

import { parseEphemerisData } from './getEphemeris';

interface EphemerisRow {
  date: string | null;
  data: unknown;
}

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getRange = (range: 'month' | 'week') => {
  const start = new Date();
  const end = new Date(start);

  if (range === 'month') {
    end.setMonth(start.getMonth() + 1, 0);
  } else {
    end.setDate(start.getDate() + ((7 - start.getDay()) % 7));
  }

  return { start: toDateKey(start), end: toDateKey(end) };
};

export const getEphemerisRange = async (
  value: 'month' | 'week',
): Promise<EphemerisByRangeResponse | null> => {
  const { start, end } = getRange(value);
  const { entries } = await backend.invoke<{ entries: EphemerisRow[] }>(
    'astrology-content',
    {
      action: 'ephemerisRange',
      from: start,
      to: end,
    },
  );

  if (!Array.isArray(entries)) return null;

  return entries
    .map(({ data }) => parseEphemerisData(data))
    .filter((item): item is EphemerisByRangeResponse[number] => item !== null);
};
