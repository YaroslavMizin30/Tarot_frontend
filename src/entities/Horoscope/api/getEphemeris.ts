import camelize from 'camelize';
import type { EphemerisResponse } from '../types';

export const getEphemeris = async () => {
  const { data } = await window.supabase.functions.invoke('calendar', {
    body: { type: 'ephemeris' },
  });

  if (!data) {
    return null;
  }

  return camelize(JSON.parse(data) as EphemerisResponse);
};
