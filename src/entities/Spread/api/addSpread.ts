import type { Spread } from '../types';

import { getSpreads } from './getSpreads';

import { insertRaw } from '@/shared/api/supabase';
import { updateRaw } from '@/shared/api/supabase';

export const addSpread = async (id: string, spread: Spread) => {
  const spreads = await getSpreads(id);

  if (spreads) {
    await updateRaw(
      'spreads',
      {
        spreads: JSON.stringify([...spreads, spread]),
      },
      { key: 'user_id', value: id },
    );
  } else {
    await insertRaw('spreads', {
      spreads: JSON.stringify([spread]),
      user_id: id,
    });
  }
};
