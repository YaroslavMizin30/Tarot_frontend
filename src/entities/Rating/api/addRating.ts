import { insertRaw } from '@/shared/api/supabase';

import type { Rating, RatingPayload } from '../types';

export const addRating = async (
  userId: number,
  payload: RatingPayload,
): Promise<Rating> => {
  const data = await insertRaw<Rating>('app_ratings', { ...payload, userId });

  if (!data) {
    throw new Error('Failed to add rating');
  }

  return data[0];
};
