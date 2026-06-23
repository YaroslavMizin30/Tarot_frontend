import { getDataFromDB } from '@/shared/api/supabase';

import type { Rating } from '../types';

export const getRating = async (
  userId: number,
): Promise<Rating | null> => {
  const data = await getDataFromDB<Rating>('app_ratings', {
    key: 'userId',
    value: String(userId),
  });

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};
