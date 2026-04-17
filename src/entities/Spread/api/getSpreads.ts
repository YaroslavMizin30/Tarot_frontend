import { getDataFromDB } from '@/shared/api/supabase';

import type { Spread } from '../types';

export const getSpreads = async (id: string) => {
  const { data } = await getDataFromDB<{ user_id: string; spreads: string }>(
    'spreads',
    ['*'],
    {
      key: 'user_id',
      value: id,
    },
  );

  if (!data) {
    return null;
  }

  const { user_id, spreads } = data[0];

  return { id: user_id, spreads: JSON.parse(spreads) as Spread[] };
};
