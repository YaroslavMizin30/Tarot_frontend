import type { Spread } from '../types';

import { insertRaw } from '@/shared/api/supabase';

export const addSpread = async (id: string, spread: Spread) => {
  await insertRaw('spreads', { spreads: JSON.stringify(spread), id });
};
