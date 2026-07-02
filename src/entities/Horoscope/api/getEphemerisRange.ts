import camelize from 'camelize';
import type { EphemerisByRangeResponse } from '../types';

import { getDataFromDB } from '@/shared/api/supabase';

export const getEphemerisRange = async (value: 'month' | 'week') => {
  const data = await getDataFromDB<EphemerisByRangeResponse>('calendar', {
    key: 'type',
    value,
  });

  if (!data) {
    return null;
  }

  // @ts-expect-error error
  return camelize(JSON.parse(data[0].data)) as EphemerisByRangeResponse;
};
