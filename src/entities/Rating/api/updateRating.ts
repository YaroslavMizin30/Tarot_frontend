import { updateRaw } from '@/shared/api/supabase';

import type { Rating, RatingPayload } from '../types';

export const updateRating = async (
  userId: number,
  payload: RatingPayload,
): Promise<Rating> => {
  const data = await updateRaw<Rating>('app_ratings', { ...payload }, {
    key: 'userId',
    value: userId,
  });

  if (!data) {
    throw new Error('Failed to update rating');
  }

  return data[0];
};
