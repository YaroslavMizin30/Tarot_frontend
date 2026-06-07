import camelize from 'camelize';

import { getDataFromDB } from '@/shared/api/supabase';

import type { Rating, RatingResponse } from '../types';

export const getRating = async (
  userId: number,
): Promise<Rating | null> => {
  const { data } = await getDataFromDB<RatingResponse>('app_ratings', ['*'], {
    key: 'user_id',
    value: String(userId),
  });

  if (!data || data.length === 0) {
    return null;
  }

  return camelize(data[0]) as Rating;
};
