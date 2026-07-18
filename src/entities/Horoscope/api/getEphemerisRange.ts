import type { EphemerisByRangeResponse } from '../types';

import { getDataFromDB } from '@/shared/api/supabase';

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
  const rows = await getDataFromDB<EphemerisRow>(
    'calendar',
    { key: 'type', value: 'ephemeris' },
    {
      params: {
        date: `gte.${start}`,
        and: `(date.lte.${end})`,
        order: 'date.asc',
      },
    },
  );

  if (rows === null) return null;

  return rows
    .map(({ data }) => parseEphemerisData(data))
    .filter((item): item is EphemerisByRangeResponse[number] => item !== null);
};
