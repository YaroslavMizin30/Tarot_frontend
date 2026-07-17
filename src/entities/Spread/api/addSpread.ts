import type { Spread } from '../types';

import { insertRaw } from '@/shared/api/supabase';

export const addSpread = async (spread: Spread) => {
  const insertedSpread = await insertRaw<Spread>('spreads', {
    ...spread,
    cards: JSON.stringify(spread.cards),
  });

  if (!insertedSpread?.length) {
    throw new Error('Failed to create spread');
  }

  return insertedSpread[0];
};
