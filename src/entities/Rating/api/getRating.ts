import { getDataFromDB } from '@/shared/api/supabase';

import type { Rating } from '../types';

export const getRating = async (
  appUserId: string,
): Promise<Rating | null> => {
  const data = await getDataFromDB<Rating>('app_ratings', {
    key: 'appUserId',
    value: appUserId,
  });

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};
