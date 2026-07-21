import camelize from 'camelize';

import type { EphemerisResponse } from '../types';

import { backend } from '@/shared/api/backend';

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
  const { entry } = await backend.invoke<{ entry: EphemerisRow | null }>(
    'astrology-content',
    {
      action: 'ephemerisLatest',
      onOrBefore: today,
    },
  );

  return entry ? parseEphemerisData(entry.data) : null;
};
