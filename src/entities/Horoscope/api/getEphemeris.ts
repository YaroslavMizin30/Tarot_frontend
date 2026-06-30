import camelize from 'camelize';
import type { EphemerisResponse } from '../types';

import { getDataFromDB } from '@/shared/api/supabase';

export const getEphemeris = async () => {
  const data = await getDataFromDB<EphemerisResponse>('calendar', {
    key: 'type',
    value: 'ephemeris',
  });

  if (!data) {
    return null;
  }

  // @ts-expect-error error
  return camelize(JSON.parse(data[0].data)) as EphemerisResponse;
};
