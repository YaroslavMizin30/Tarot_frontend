import type { Spread } from '../types';

import { insertRaw } from '@/shared/api/supabase';

export const addSpread = async (spread: Spread) => {
  await insertRaw('spreads', {
    ...spread,
    cards: JSON.stringify(spread.cards),
  });
};
