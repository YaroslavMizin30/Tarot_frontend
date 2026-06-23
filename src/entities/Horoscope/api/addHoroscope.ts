import { insertRaw } from '@/shared/api/supabase';

import type { Horoscope } from '../types';

export const addHoroscope = async (horoscope: Horoscope) => {
  await insertRaw('predictions', { ...horoscope });
};
