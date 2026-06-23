import { getDataFromDB } from '@/shared/api/supabase';

import type { Spread } from '../types';

export const getSpreads = async (id: string): Promise<Spread[] | null> => {
  const data = await getDataFromDB<Spread>('spreads', {
    key: 'userId',
    value: id,
  });

  if (!data) {
    return null;
  }

  return data.map((spread) => ({
    ...spread,
    cards: JSON.parse(spread.cards as unknown as string),
  }));
};
