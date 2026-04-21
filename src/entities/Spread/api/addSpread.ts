import snakeize from 'snakeize';

import type { Spread } from '../types';

import { insertRaw } from '@/shared/api/supabase';

export const addSpread = async (spread: Spread) => {
  await insertRaw(
    'spreads',
    snakeize({
      ...spread,
      cards: JSON.stringify(spread.cards),
    }),
  );
};
