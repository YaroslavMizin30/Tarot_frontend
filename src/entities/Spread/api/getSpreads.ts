import { getDataFromDB } from '@/shared/api/supabase';

import type { Spread } from '../types';

export const getSpreads = async (id: string) => {
  const { data } = await getDataFromDB<Spread[]>('spreads', ['*'], {
    key: 'user_id',
    value: id,
  });

  if (!data) {
    return null;
  }

  return data[0];
};
