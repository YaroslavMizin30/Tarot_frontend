import camelize from 'camelize';

import type { EphemerisResponse } from '../types';

import { getDataFromDB } from '@/shared/api/supabase';

interface EphemerisRow {
  date: string | null;
  data: unknown;
}

export const parseEphemerisData = (
  value: unknown,
): EphemerisResponse | null => {
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

  return camelize(parsed) as EphemerisResponse;
};

export const getEphemeris = async (): Promise<EphemerisResponse | null> => {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await getDataFromDB<EphemerisRow>(
    'calendar',
    { key: 'type', value: 'ephemeris' },
    {
      params: {
        date: `lte.${today}`,
        order: 'date.desc',
        limit: '1',
      },
    },
  );

  return rows?.[0] ? parseEphemerisData(rows[0].data) : null;
};
