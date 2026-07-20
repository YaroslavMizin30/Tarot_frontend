import { insertRaw } from '@/shared/api/supabase';

import type { Rating, RatingPayload } from '../types';

export const addRating = async (
  appUserId: string,
  profileId: number,
  payload: RatingPayload,
): Promise<Rating> => {
  const data = await insertRaw<Rating>('app_ratings', {
    ...payload,
    userId: profileId,
    appUserId,
  });

  if (!data) {
    throw new Error('Failed to add rating');
  }

  return data[0];
};
