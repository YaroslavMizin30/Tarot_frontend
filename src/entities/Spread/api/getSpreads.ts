import camelize from 'camelize';

import { getDataFromDB } from '@/shared/api/supabase';

import type { Spread, SpreadResponse } from '../types';

export const getSpreads = async (id: string): Promise<Spread[] | null> => {
  const { data } = await getDataFromDB<SpreadResponse>('spreads', ['*'], {
    key: 'user_id',
    value: id,
  });

  if (!data) {
    return null;
  }

  const mappedSpreads = data.map((spread) => {
    return camelize({
      ...spread,
      cards: JSON.parse(spread.cards),
    });
  });

  return mappedSpreads;
};
